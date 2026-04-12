import { useState } from 'react'
import { motion } from 'framer-motion'
import useSpeech from '../hooks/useSpeech'

export default function SpeechInput({ onInput }) {
  const [text, setText] = useState('')
  const { isListening, transcript, startListening, stopListening } = useSpeech()

  const handleSubmit = () => {
    const val = text.trim() || transcript.trim()
    if (val) {
      onInput(val)
      setText('')
    }
  }

  const handleMic = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening((result) => {
        onInput(result)
        setText('')
      })
    }
  }

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input
        value={isListening ? transcript : text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="Type a message to the deaf user..."
        style={{
          flex: 1, background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 10, padding: '10px 14px',
          color: 'var(--text-primary)', fontSize: 14,
          outline: 'none', fontFamily: 'inherit'
        }}
      />
      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={handleMic}
        style={{
          width: 42, height: 42, borderRadius: 10, border: 'none',
          background: isListening 
            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
            : 'var(--bg-secondary)',
          border: `1px solid ${isListening ? '#ef4444' : 'var(--border)'}`,
          cursor: 'pointer', fontSize: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
        title={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {isListening ? (
          <span className="recording-dot">🔴</span>
        ) : '🎤'}
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={handleSubmit}
        className="btn-primary"
        style={{ padding: '10px 18px', fontSize: 14, borderRadius: 10 }}
      >
        Send
      </motion.button>
    </div>
  )
}
