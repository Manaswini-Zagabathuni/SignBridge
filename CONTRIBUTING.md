# Contributing to SignBridge 🤟

Thank you for your interest in contributing! This guide will help you get started.

---

## 🏗️ Development Setup

### 1. Fork & Clone
```bash
git clone https://github.com/YOUR_USERNAME/signbridge.git
cd signbridge
```

### 2. Create a branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Run frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Run backend
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # Fill in your MongoDB URI
python app.py
```

---

## 📁 Project Structure at a Glance

```
frontend/src/
├── components/    UI components (Camera, Avatar, Chat, etc.)
├── hooks/         Custom React hooks (MediaPipe, TF.js, Speech)
├── pages/         Route-level pages (Home, Bridge)
└── utils/         Pure utility functions

backend/
├── routes/        Flask route blueprints
└── models/        MongoDB data models

model/
├── train_model.py      Train + export the ASL TF.js model
└── data_collector.py   Collect your own training data
```

---

## 🎯 Good First Issues

- [ ] Add support for more ASL words beyond single letters
- [ ] Improve the signing avatar with better hand animations
- [ ] Add BSL (British Sign Language) support
- [ ] Add a "Practice Mode" where users can test their signing
- [ ] Add unit tests for landmark normalization utilities
- [ ] Add mobile responsiveness to the Bridge page
- [ ] Dark/light theme toggle

---

## 📋 Pull Request Checklist

Before submitting a PR, please ensure:
- [ ] Code runs without errors
- [ ] Frontend builds successfully (`npm run build`)
- [ ] You've tested your change in Chrome (primary supported browser)
- [ ] PR description clearly explains what changed and why

---

## 🐛 Reporting Bugs

Open an issue with:
1. **What happened** — describe the bug
2. **Steps to reproduce** — exact steps to trigger it
3. **Expected behavior** — what you expected
4. **Browser + OS** — e.g. Chrome 120 on macOS 14
5. **Console errors** — paste any errors from DevTools

---

## 💬 Questions?

Open a GitHub Discussion or reach out via LinkedIn.
