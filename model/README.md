# 🧠 SignBridge Model

This folder contains scripts to train and export the ASL recognition model used by SignBridge.

---

## Quick Start

### Option A — Use a Pre-trained Model (Recommended for beginners)

1. Download a pre-trained ASL landmark model from one of these sources:
   - [Kaggle: ASL Alphabet Landmark Dataset](https://www.kaggle.com/datasets/grassknoted/asl-alphabet)
   - [MediaPipe Hand Gesture Recognizer](https://developers.google.com/mediapipe/solutions/vision/gesture_recognizer)

2. Convert to TF.js format and place in:
   ```
   frontend/public/model/
   ├── model.json
   └── group1-shard1of1.bin
   ```

3. Done! The app auto-loads it at startup.

---

### Option B — Collect Your Own Data + Train

#### Step 1: Collect landmark data
```bash
pip install opencv-python mediapipe numpy pandas
python data_collector.py
```
- Your webcam will open
- For each letter (A–Z + SPACE + DEL), hold the sign steady and press **SPACE** to capture
- 100 samples per class = 2,800 total samples
- Saved to `data/landmarks.csv`

#### Step 2: Train the model
```bash
pip install tensorflow tensorflowjs scikit-learn
python train_model.py
```
- Trains a 4-layer dense neural network on your landmarks
- Exports TF.js model to `model/tfjs_model/`

#### Step 3: Copy to frontend
```bash
cp -r model/tfjs_model/ ../frontend/public/model/
```

---

## Model Architecture

```
Input: 63 features (21 landmarks × x,y,z)
       ↓
Dense(128) + BatchNorm + Dropout(0.3)
       ↓
Dense(64)  + BatchNorm + Dropout(0.2)
       ↓
Dense(32)
       ↓
Dense(28, softmax)  →  A-Z + SPACE + DEL
```

**Why landmarks instead of raw images?**
- Much smaller model (~50KB vs ~10MB for CNN)
- Runs at 60fps in-browser via TensorFlow.js
- Invariant to lighting, skin tone, background
- Works on any device with a camera

---

## Expected Accuracy

| Dataset Size | Expected Val Accuracy |
|---|---|
| 100 samples/class (self-collected) | ~85–92% |
| 500 samples/class | ~93–97% |
| Public ASL dataset (thousands/class) | ~97–99% |

---

## Improving the Model

- Collect more diverse data (different lighting, hand sizes, camera angles)
- Add data augmentation (slight rotations, flips)
- Use an LSTM/GRU over sequences of frames for motion-based signs (J, Z)
- Fine-tune on edge cases that confuse the model (M/N, U/V)
