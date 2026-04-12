"""
SignBridge — ASL Model Training Script
======================================
This script trains a TensorFlow model on ASL hand landmark data
and exports it to TensorFlow.js format for in-browser inference.

Dataset: 
  - ASL Alphabet dataset from Kaggle (hand landmark version)
  - Or collect your own using the data_collector.py script

Usage:
  pip install tensorflow tensorflowjs scikit-learn numpy pandas
  python train_model.py

Output:
  model/tfjs_model/   ← Copy this folder to frontend/public/model/
"""

import numpy as np
import tensorflow as tf
from tensorflow import keras
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import os
import json

# ─── CONFIG ──────────────────────────────────────────────────────────────────
DATASET_PATH = 'data/landmarks.csv'   # Your landmark CSV file
MODEL_OUT    = 'model/tfjs_model'
EPOCHS       = 50
BATCH_SIZE   = 32
CLASSES      = list('ABCDEFGHIJKLMNOPQRSTUVWXYZ') + ['SPACE', 'DEL']

# ─── LANDMARK NORMALIZATION ───────────────────────────────────────────────────
def normalize_landmarks(raw: np.ndarray) -> np.ndarray:
    """
    Normalize 63 landmark values (21 × xyz) relative to wrist.
    Makes the model invariant to hand position and scale.
    """
    # Reshape to (21, 3)
    lms = raw.reshape(21, 3)
    wrist = lms[0]
    relative = lms - wrist
    max_dist = np.max(np.linalg.norm(relative, axis=1)) or 1.0
    normalized = relative / max_dist
    return normalized.flatten()


# ─── BUILD MODEL ─────────────────────────────────────────────────────────────
def build_model(num_classes: int) -> keras.Model:
    model = keras.Sequential([
        keras.layers.Input(shape=(63,)),
        keras.layers.Dense(128, activation='relu'),
        keras.layers.BatchNormalization(),
        keras.layers.Dropout(0.3),
        keras.layers.Dense(64, activation='relu'),
        keras.layers.BatchNormalization(),
        keras.layers.Dropout(0.2),
        keras.layers.Dense(32, activation='relu'),
        keras.layers.Dense(num_classes, activation='softmax')
    ])
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    return model


# ─── TRAIN ───────────────────────────────────────────────────────────────────
def train():
    print("📂 Loading dataset...")

    if not os.path.exists(DATASET_PATH):
        print(f"⚠️  Dataset not found at {DATASET_PATH}")
        print("   Creating synthetic data for testing...")
        # Synthetic demo data — replace with real data
        X = np.random.randn(2800, 63).astype(np.float32)
        y = np.repeat(np.arange(28), 100)
        np.random.shuffle(y)
    else:
        import pandas as pd
        df = pd.read_csv(DATASET_PATH)
        # Expected columns: label + 63 landmark features (x0,y0,z0,...,x20,y20,z20)
        labels = df['label'].values
        features = df.drop('label', axis=1).values.astype(np.float32)

        le = LabelEncoder()
        le.fit(CLASSES)
        y = le.transform(labels)
        X = np.array([normalize_landmarks(row) for row in features])

    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print(f"✅ Dataset: {len(X_train)} train / {len(X_val)} val samples")
    print(f"   Classes: {len(CLASSES)}")

    model = build_model(len(CLASSES))
    model.summary()

    callbacks = [
        keras.callbacks.EarlyStopping(patience=8, restore_best_weights=True),
        keras.callbacks.ReduceLROnPlateau(patience=4, factor=0.5),
        keras.callbacks.ModelCheckpoint('model/best_model.keras', save_best_only=True)
    ]

    print("\n🚀 Training...")
    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=EPOCHS,
        batch_size=BATCH_SIZE,
        callbacks=callbacks,
        verbose=1
    )

    val_acc = max(history.history['val_accuracy'])
    print(f"\n🎯 Best validation accuracy: {val_acc:.4f} ({val_acc*100:.2f}%)")

    # Export to TensorFlow.js
    print(f"\n📦 Exporting to TensorFlow.js → {MODEL_OUT}")
    os.makedirs(MODEL_OUT, exist_ok=True)

    try:
        import tensorflowjs as tfjs
        tfjs.converters.save_keras_model(model, MODEL_OUT)
        print(f"✅ Model exported to {MODEL_OUT}/")
        print(f"\n📋 Next step:")
        print(f"   Copy {MODEL_OUT}/ → frontend/public/model/")
    except ImportError:
        print("⚠️  tensorflowjs not installed. Install with:")
        print("   pip install tensorflowjs")
        model.save('model/saved_model.keras')
        print("   Saved as model/saved_model.keras instead")

    # Save class mapping
    with open('model/classes.json', 'w') as f:
        json.dump(CLASSES, f)
    print("✅ Class mapping saved to model/classes.json")


if __name__ == '__main__':
    os.makedirs('model', exist_ok=True)
    train()
