# GuardianAI - Cyberbullying Detection & Protection System

🛡️ **Real-time AI-powered cyberbullying detection and monitoring platform** designed to protect users in digital communication environments.

## 🔒 Cybersecurity Features

### Core Protection Capabilities
- **Real-time Threat Detection**: AI-powered analysis of chat messages to identify cyberbullying patterns
- **Multi-type Bullying Classification**: Detects harassment, threatening behavior, sexual harassment, exclusion, cyberstalking, and flaming
- **Confidence Scoring**: Machine learning models provide confidence scores (0-100%) for threat assessment
- **Severity Assessment**: Automatic classification of threats as low, medium, high, or critical
- **Contextual Analysis**: Maintains conversation history for improved detection accuracy

### Alert System
- **Instant Notifications**: Real-time alerts sent to parent dashboard when threats are detected
- **Consecutive Pattern Detection**: Triggers alerts after 3 consecutive high-confidence bullying messages (>85% confidence)
- **Browser Notifications**: Native browser notifications for immediate awareness
- **Alert Management**: Review, resolve, or dismiss detected threats

### Security Architecture
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Role-based Access**: Parent dashboard access for monitoring and intervention
- **Encrypted Communication**: Secure WebSocket connections for real-time data
- **Data Protection**: User data protection with proper access controls

## 🚀 Technology Stack

### Frontend Security Features
- **React 19** with modern security best practices
- **Socket.io-client** for secure real-time communication
- **Axios** with timeout protection for API calls
- **React Router DOM** with protected routes
- **Tailwind CSS** for responsive security dashboard

### Backend Security Infrastructure
- **Express.js** with CORS protection and security middleware
- **Socket.io** for secure real-time event handling
- **MongoDB** with Mongoose ODM for secure data storage
- **JWT** for secure authentication tokens
- **bcryptjs** for password hashing
- **Cookie-parser** with secure cookie handling

### AI/ML Detection Engine
- **FastAPI** Python backend for ML model serving
- **Transformers** library with pre-trained cyberbullying detection models
- **Contextual Analysis**: Maintains conversation history (10 messages) for pattern recognition
- **Real-time Processing**: Sub-second analysis of incoming messages

## 📊 Detection Categories

### Bullying Types Detected
- **Harassment**: Repeated unwanted contact or behavior
- **Threatening**: Direct or indirect threats of harm
- **Sexual**: Inappropriate sexual content or advances
- **Exclusion**: Deliberate exclusion from groups or conversations
- **Cyberstalking**: Persistent monitoring or tracking behavior
- **Flaming**: Aggressive or hostile online behavior
- **General Harassment**: Broad category for other harmful behaviors

### Severity Levels
- **Low**: Minor incidents with low confidence (<70%)
- **Medium**: Moderate threats (70-85% confidence)
- **High**: Serious threats (85-95% confidence)
- **Critical**: Immediate danger (>95% confidence)

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- Python 3.8+
- MongoDB
- CUDA (optional, for GPU acceleration)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure .env with your MongoDB URI and JWT secret
npm run dev
```

### ML Model Setup
```bash
cd python
pip install -r requirements.txt
# Download cyberbullying detection model to ./model directory
python app.py
```

### Frontend Setup
```bash
npm install
npm run dev
```

## 🔧 Configuration

### Environment Variables
```env
# Backend (.env)
MONGODB_URI=mongodb://localhost:27017/guardianai
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:5173
ML_API_URL=http://localhost:8000
PORT=5000

# ML API (optional)
CUDA_VISIBLE_DEVICES=0  # For GPU acceleration
```

## 📱 Dashboard Features

### Parent Safety Dashboard
- **Real-time Monitoring**: Live view of all detected threats
- **Statistics Panel**: Total alerts, pending reviews, critical incidents
- **Alert Filtering**: Filter by severity, status, or time period
- **Quick Actions**: Resolve or dismiss alerts with one click
- **User Identification**: Clear victim and perpetrator identification
- **Timestamp Tracking**: Precise incident timing for investigation

### Alert Management
- **Status Tracking**: Pending, reviewed, resolved, or dismissed
- **Confidence Display**: ML model confidence percentages
- **Message Context**: Full message content for review
- **User Profiles**: Victim and bully information with avatars

## 🔍 Detection Algorithm

### Pattern Recognition
1. **Message Analysis**: Each message is analyzed in real-time
2. **Context Building**: Maintains 10-message conversation history
3. **ML Classification**: Uses transformer-based model for classification
4. **Confidence Scoring**: Calculates threat confidence (0-100%)
5. **Pattern Detection**: Tracks consecutive high-confidence messages
6. **Alert Triggering**: Creates alerts when thresholds are met

### Threshold Configuration
- **Single Message Alert**: >95% confidence
- **Pattern Alert**: 3 consecutive messages >85% confidence
- **History Window**: Last 10 messages for context
- **Score Tracking**: Last 3 high-confidence scores

## 🛡️ Security Considerations

### Data Protection
- **PII Protection**: Limited user data exposure in alerts
- **Secure Storage**: Encrypted database connections
- **Access Control**: Role-based dashboard access
- **Audit Trail**: Complete alert history with timestamps

### Privacy Features
- **Minimal Data Collection**: Only essential data for detection
- **User Consent**: Clear notification of monitoring
- **Data Retention**: Configurable alert retention policies
- **Secure Deletion**: Proper data cleanup procedures

## 🚀 Deployment

### Production Deployment
```bash
# Backend
npm run build
npm start

# Frontend
npm run build
# Deploy dist/ folder to web server

# ML API
uvicorn app:app --host 0.0.0.0 --port 8000
```

### Docker Deployment
```dockerfile
# Multi-stage build for production
# Includes backend, frontend, and ML API
# Environment-specific configurations
```
