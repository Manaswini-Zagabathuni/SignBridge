"""
SignBridge — ASL Data Collector
================================
Run this script to collect your own ASL hand landmark training data.
It opens your webcam, lets you hold each sign for 3 seconds,
and saves the landmark data to a CSV file.

Usage:
  pip install opencv-python mediapipe numpy pandas
  python data_collector.py

Controls:
  SPACE — capture current sign (hold sign steady first)
  Q     — quit
  R     — redo last capture
"""

import cv2
import mediapipe as mp
import numpy as np
import pandas as pd
import os
import time

CLASSES = list('ABCDEFGHIJKLMNOPQRSTUVWXYZ') + ['SPACE', 'DEL']
SAMPLES_PER_CLASS = 100
OUTPUT_PATH = 'data/landmarks.csv'

mp_hands = mp.solutions.hands
mp_draw = mp.solutions.drawing_utils


def normalize_landmarks(landmarks):
    lms = np.array([[lm.x, lm.y, lm.z] for lm in landmarks])
    wrist = lms[0]
    relative = lms - wrist
    max_dist = np.max(np.linalg.norm(relative, axis=1)) or 1.0
    return (relative / max_dist).flatten()


def collect():
    os.makedirs('data', exist_ok=True)

    all_rows = []
    cap = cv2.VideoCapture(0)

    with mp_hands.Hands(
        max_num_hands=1,
        min_detection_confidence=0.7,
        min_tracking_confidence=0.6
    ) as hands:
        for cls in CLASSES:
            print(f"\n📸 Collecting: {cls}  ({CLASSES.index(cls)+1}/{len(CLASSES)})")
            print(f"   Show the '{cls}' sign and press SPACE to capture")
            count = 0

            while count < SAMPLES_PER_CLASS:
                ret, frame = cap.read()
                if not ret:
                    break

                frame = cv2.flip(frame, 1)
                rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                results = hands.process(rgb)

                # Draw landmarks
                if results.multi_hand_landmarks:
                    for hand_lms in results.multi_hand_landmarks:
                        mp_draw.draw_landmarks(frame, hand_lms, mp_hands.HAND_CONNECTIONS)

                # UI overlay
                cv2.rectangle(frame, (0, 0), (640, 60), (0, 0, 0), -1)
                cv2.putText(frame, f"Sign: {cls}  Collected: {count}/{SAMPLES_PER_CLASS}",
                    (10, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (124, 58, 237), 2)
                cv2.putText(frame, "SPACE = capture  Q = quit  R = redo",
                    (10, 55), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (150, 150, 150), 1)

                cv2.imshow('SignBridge Data Collector', frame)
                key = cv2.waitKey(1) & 0xFF

                if key == ord('q'):
                    cap.release()
                    cv2.destroyAllWindows()
                    save_csv(all_rows, OUTPUT_PATH)
                    return

                if key == ord('r') and all_rows and all_rows[-1][0] == cls:
                    all_rows.pop()
                    count -= 1
                    print(f"   Removed last capture. Count: {count}")

                if key == ord(' '):
                    if results.multi_hand_landmarks:
                        features = normalize_landmarks(results.multi_hand_landmarks[0].landmark)
                        all_rows.append([cls] + features.tolist())
                        count += 1
                        print(f"   ✅ Captured {count}/{SAMPLES_PER_CLASS}")
                    else:
                        print("   ⚠️  No hand detected. Reposition and try again.")

    cap.release()
    cv2.destroyAllWindows()
    save_csv(all_rows, OUTPUT_PATH)


def save_csv(rows, path):
    cols = ['label'] + [f'{axis}{i}' for i in range(21) for axis in ['x', 'y', 'z']]
    df = pd.DataFrame(rows, columns=cols)
    df.to_csv(path, index=False)
    print(f"\n✅ Saved {len(df)} samples to {path}")
    print(f"   Next: run python train_model.py")


if __name__ == '__main__':
    collect()
