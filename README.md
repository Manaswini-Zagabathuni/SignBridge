# SignBridge - Bidirectional Sign Language Communication Platform

<div align="center">
 
![SignBridge Banner](https://img.shields.io/badge/SignBridge-Two--Way%20ASL%20Communication-6C63FF?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TensorFlow](https://img.shields.io/badge/TensorFlow.js-Latest-FF6F00?style=for-the-badge&logo=tensorflow)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)

**A real-time, two-way sign language communication web app bridging the gap between deaf and hearing communities.**

[Live Demo](#) · [Report Bug](issues) · [Request Feature](issues)

</div>

---

## What Makes SignBridge Unique?

Most sign language apps do **one thing** - either recognize signs OR display animations. SignBridge does **both, simultaneously, in one interface**:

| Direction | Who Benefits | How It Works |
|---|---|---|
|  Sign → Text/Speech | Hearing person | Camera detects ASL hand landmarks → TensorFlow.js classifies → Text displayed + spoken aloud |
|  Text/Speech → Sign Avatar | Deaf person | Hearing person types or speaks → 3D avatar performs the corresponding signs |

---

##  Features

-  **Real-time ASL Recognition** - MediaPipe Hands tracks 21 hand landmarks per frame
-  **TensorFlow.js Model** - Classifies ASL letters (A-Z) and common words
-  **Animated Sign Avatar** - 3D avatar signs back to the deaf user
-  **Speech Output** - Recognized signs are spoken aloud via Web Speech API
-  **Voice Input** - Hearing users can speak; text is converted to avatar signs
-  **Confidence Score** - Visual indicator of model certainty per prediction
-  **Sign Learning Sidebar** - Shows the sign being performed so hearing users learn passively
-  **Conversation History** - Full session transcripts saved in MongoDB
-  **Export Transcript** - Download conversation as a text file

---

## Tech Stack

### Frontend
- **React 18** + Vite
- **MediaPipe Hands** - hand landmark detection
- **TensorFlow.js** - in-browser ASL classification
- **Three.js** - 3D signing avatar
- **Web Speech API** - text-to-speech & speech-to-text
- **TailwindCSS** - styling

### Backend
- **Python + Flask** - REST API
- **MongoDB + PyMongo** - conversation history storage
- **Flask-CORS** - cross-origin support

---

##  Project Structure
```
signbridge/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Camera.jsx          # Webcam + MediaPipe hand tracking
│   │   │   ├── SignAvatar.jsx       # 3D animated signing avatar
│   │   │   ├── ChatPanel.jsx        # Conversation display panel
│   │   │   ├── ConfidenceBar.jsx    # Model confidence indicator
│   │   │   ├── LearningSidebar.jsx  # Sign learning panel
│   │   │   └── SpeechInput.jsx      # Voice/text input for hearing user
│   │   ├── hooks/
│   │   │   ├── useHandDetection.js  # MediaPipe integration hook
│   │   │   ├── useASLModel.js       # TensorFlow.js model hook
│   │   │   └── useSpeech.js         # Web Speech API hook
│   │   ├── utils/
│   │   │   ├── landmarkUtils.js     # Hand landmark processing
│   │   │   └── signMappings.js      # ASL letter/word mappings
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page
│   │   │   └── Bridge.jsx           # Main communication interface
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── app.py                       # Flask entry point
│   ├── routes/
│   │   ├── conversations.py         # Save/fetch conversation history
│   │   └── health.py                # Health check endpoint
│   ├── models/
│   │   └── conversation.py          # MongoDB conversation model
│   ├── requirements.txt
│   └── .env.example
├── model/
│   └── train_model.py               # Script to train/export TF.js model
└── README.md
```

---

##  Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB Atlas account (free tier works)
- Webcam

### 1. Clone the Repository
```bash
git clone https://github.com/Manaswini-Zagabathuni/signbridge.git
cd signbridge
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your MongoDB URI to .env
python app.py
```

### 4. Open the App
Visit `http://localhost:5173` in your browser and allow camera access.

---

##  How the ASL Model Works

1. **MediaPipe Hands** detects 21 hand landmarks (x, y, z coordinates) per frame
2. Landmarks are **normalized** relative to wrist position for scale/position invariance
3. A **TensorFlow.js neural network** (trained on ASL datasets) classifies the 63-dimensional landmark vector into one of 26 letters or common words
4. Predictions are **smoothed** over 5 frames to reduce flickering
5. Letters are **assembled into words** using a space-gesture trigger

---

##  Model Architecture

```
Input: 63 features (21 landmarks × 3 axes)
→ Dense(128, relu) + Dropout(0.3)
→ Dense(64, relu) + Dropout(0.2)
→ Dense(32, relu)
→ Dense(27, softmax)   ← 26 letters + space
```

---

##  Roadmap

- [ ] Add support for full ASL words (not just letters)
- [ ] Two-user video call mode with real-time translation overlay
- [ ] Mobile PWA support
- [ ] Support for BSL (British Sign Language)
- [ ] Emotion-aware avatar facial expressions

---


##  Author

**Manaswini Zagabathuni**  
MS Computer Science, Indiana University Bloomington  
[LinkedIn](https://linkedin.com/in/manaswini-zagabathuni-8456a3297)


