# app.py

import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from transformers import pipeline
import requests
import uvicorn
from collections import defaultdict, deque

# ==============================================================================
# 1. Initialize the Application and Load the Model
# ==============================================================================

# Initialize FastAPI app
app = FastAPI(
    title="Cyberbullying Detection API",
    description="An API to detect cyberbullying in chat messages in real-time.",
    version="1.0.0"
)

# Define the path to your fine-tuned model
MODEL_PATH = "models/roberta_final"

# Load the fine-tuned model using the Hugging Face pipeline
# This is the easiest way to use a model for inference.
# We specify device=0 to use the GPU if available.
try:
    print(f"Loading model from: {MODEL_PATH}")
    classifier = pipeline(
        "text-classification",
        model=MODEL_PATH,
        tokenizer=MODEL_PATH,
        device=0 if os.getenv("CUDA_VISIBLE_DEVICES") else -1 # Use GPU if available
    )
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"!!! Error loading model: {e} !!!")
    classifier = None

# ==============================================================================
# 2. In-Memory State Management
# ==============================================================================

# This dictionary will act as our in-memory "database" to store recent messages
# and scores for each conversation. The deque will automatically keep only the
# last 10 messages.
conversation_history = defaultdict(lambda: deque(maxlen=10))

# This dictionary will store the recent confidence scores for bullying
conversation_scores = defaultdict(lambda: deque(maxlen=3))

# Define the parent dashboard URL (replace with your actual URL)
PARENT_DASHBOARD_URL = "https://your-parent-dashboard.com/api/alert"

# ==============================================================================
# 3. Define API Request and Response Models
# ==============================================================================

class Message(BaseModel):
    conversation_id: str
    text: str

class AnalysisResponse(BaseModel):
    status: str
    is_bullying: bool
    confidence_score: float

# ==============================================================================
# 4. Define the Main API Endpoint
# ==============================================================================

@app.post("/analyze-conversation", response_model=AnalysisResponse)
async def analyze_message(message: Message):
    """
    Receives a message, analyzes it in the context of the conversation,
    and checks if an alert needs to be sent.
    """
    if not classifier:
        raise HTTPException(status_code=500, detail="Model is not available.")

    # --- Step A: Update Conversation History ---
    # Add the new message to the history for this conversation
    conversation_history[message.conversation_id].append(message.text)
    
    # Combine the recent messages into a single string for context
    contextual_text = " . ".join(conversation_history[message.conversation_id])

    # --- Step B: Run Model Inference ---
    try:
        result = classifier(contextual_text)[0]
        # The model outputs 'LABEL_1' for bullying and 'LABEL_0' for not bullying
        is_bullying = True if result['label'] == 'LABEL_1' else False
        confidence_score = result['score'] if is_bullying else 1.0 - result['score']
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model inference failed: {e}")

    # --- Step C: Check for Alert Condition ---
    conversation_scores[message.conversation_id].append(confidence_score)
    
    # Check if the last 3 scores were all above the threshold
    if len(conversation_scores[message.conversation_id]) == 3:
        recent_scores = list(conversation_scores[message.conversation_id])
        if all(score > 0.85 for score in recent_scores):
            print(f"ALERT! High-risk detected in conversation {message.conversation_id}. Sending alert...")
            try:
                # Send a POST request to the parent dashboard
                alert_payload = {
                    "conversation_id": message.conversation_id,
                    "timestamp": "current_timestamp_here", # You can add a timestamp
                    "severity": "high"
                }
                # Use a background task in a real app to avoid blocking
                requests.post(PARENT_DASHBOARD_URL, json=alert_payload)
            except requests.exceptions.RequestException as e:
                print(f"!!! Failed to send alert to parent dashboard: {e} !!!")
    
    return {
        "status": "analyzed",
        "is_bullying": is_bullying,
        "confidence_score": confidence_score
    }

# Health check endpoint
@app.get("/")
def read_root():
    return {"status": "Cyberbullying Detection API is running."}

# ==============================================================================
# 5. Run the Application (for local testing)
# ==============================================================================

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

