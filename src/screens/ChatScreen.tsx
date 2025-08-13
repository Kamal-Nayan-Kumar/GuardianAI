
import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [user, setUser] = useState<any>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(u => setUser(u));
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;
    const chatRef = database().ref(`chats/${user.uid}`);
    const listener = chatRef.on('value', snapshot => {
      const data = snapshot.val() || {};
      const loadedMessages = Object.values(data) as ChatMessage[];
      loadedMessages.sort((a, b) => a.timestamp - b.timestamp);
      setMessages(loadedMessages);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });
    return () => chatRef.off('value', listener);
  }, [user]);

  const sendMessage = async () => {
    if (!text.trim() || !user) return;
    const chatRef = database().ref(`chats/${user.uid}`);

    // Push user message
    await chatRef.push({
      sender: 'user',
      text: text,
      timestamp: Date.now(),
    });

    // Push bot placeholder
    const placeholderRef = chatRef.push();
    await placeholderRef.set({
      sender: 'bot',
      text: '...',
      timestamp: Date.now(),
    });

    const currentText = text;
    setText('');

    try {
      const res = await fetch('https://your-backend.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: currentText, userId: user.uid })
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      const botReply = data.botReply || "Sorry, I didn't understand that.";

      await placeholderRef.set({
        sender: 'bot',
        text: botReply,
        timestamp: Date.now(),
      });

    } catch (e: any) {
      await placeholderRef.set({
        sender: 'bot',
        text: `Error: ${e.message || 'Something went wrong'}`,
        timestamp: Date.now(),
      });
    }
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.botRow]}>
        <Image
          source={isUser ? require('../assets/logo.jpg') : require('../assets/logo.jpg')}
          style={styles.avatar}
        />
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.botBubble]}>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', marginVertical: 4, paddingHorizontal: 8 },
  userRow: { justifyContent: 'flex-end', alignSelf: 'flex-end' },
  botRow: { justifyContent: 'flex-start', alignSelf: 'flex-start' },
  avatar: { width: 36, height: 36, borderRadius: 18, marginHorizontal: 6 },
  messageBubble: { padding: 10, maxWidth: '75%', borderRadius: 8 },
  userBubble: { backgroundColor: '#DCF8C6', borderTopRightRadius: 0 },
  botBubble: { backgroundColor: '#ECECEC', borderTopLeftRadius: 0 },
  messageText: { fontSize: 16, color: '#000' },
  inputContainer: { flexDirection: 'row', padding: 8, borderTopWidth: 1, borderColor: '#ddd', backgroundColor: 'white' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 12, fontSize: 16 },
  sendButton: { backgroundColor: '#007AFF', paddingVertical: 10, paddingHorizontal: 16, marginLeft: 6, borderRadius: 20 }
});
