import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Camera from '../components/Camera'
import ChatPanel from '../components/ChatPanel'
import ConfidenceBar from '../components/ConfidenceBar'
import LearningSidebar from '../components/LearningSidebar'
import SpeechInput from '../components/SpeechInput'
import SignAvatar from '../components/SignAvatar'
import useConversationSave from '../hooks/useConversationSave'
import { motion } from 'framer-motion'

export default function Bridge() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    { id: 1, sender: 'system', text: 'SignBridge is ready. Allow camera access and start signing!', time: new Date() }
  ])
  const [currentSign, setCurrentSign] = useState(null)
  const [confidence, setConfidence] = useState(0)
  const [currentWord, setCurrentWord] = useState('')
  const [avatarWord, setAvatarWord] = useState('')
  const [learnedSigns, setLearnedSigns] = useState([])
  const [isDetecting, setIsDetecting] = useState(false)
  const { saveConversation, incrementSignCount } = useConversationSave()

  // Auto-save when user navigates away
  useEffect(() => {
    return () => {
      saveConversation(messages)
    }
  }, [messages])


  const wordBuffer = useRef('')

  const handleSignDetected = useCallback((letter, conf) => {
    setCurrentSign(letter)
    setConfidence(conf)
    setIsDetecting(true)

    if (conf > 0.75) {
      if (letter === 'SPACE') {
        if (wordBuffer.current.trim()) {
          const word = wordBuffer.current.trim()
          setCurrentWord(word)
          setMessages(prev => {
            const last = prev[prev.length - 1]
            if (last && last.sender === 'deaf') {
              return [...prev.slice(0, -1), { ...last, text: last.text + ' ' + word }]
            }
            return [...prev, { id: Date.now(), sender: 'deaf', text: word, time: new Date() }]
          })
          setLearnedSigns(prev => {
            const existing = prev.find(s => s.letter === word)
            if (!existing) return [{ letter: word, count: 1 }, ...prev].slice(0, 20)
            return prev.map(s => s.letter === word ? { ...s, count: s.count + 1 } : s)
          })
          // Text to speech
          const utterance = new SpeechSynthesisUtterance(word)
          utterance.rate = 0.9
          window.speechSynthesis.speak(utterance)
          wordBuffer.current = ''
        }
      } else if (letter === 'DEL') {
        wordBuffer.current = wordBuffer.current.slice(0, -1)
        setCurrentWord(wordBuffer.current)
      } else {
        wordBuffer.current += letter
        setCurrentWord(wordBuffer.current)
      }
    }
  }, [])

  const handleHearingInput = useCallback((text) => {
    if (!text.trim()) return
    setMessages(prev => [...prev, {
      id: Date.now(), sender: 'hearing', text: text.trim(), time: new Date()
    }])
    setAvatarWord(text.trim())
    setTimeout(() => setAvatarWord(''), 3000)
  }, [])

  const exportTranscript = () => {
    const text = messages
      .filter(m => m.sender !== 'system')
      .map(m => `[${m.sender === 'deaf' ? 'Deaf User' : 'Hearing User'}] ${m.text}`)
      .join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `signbridge-transcript-${Date.now()}.txt`
    a.click()
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 28px', borderBottom: '1px solid var(--border)',
        background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(10px)',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/')} style={{
            background: 'none', border: 'none', color: 'var(--text-secondary)',
            cursor: 'pointer', fontSize: 18, padding: 4
          }}>←</button>
          <h1 style={{ fontSize: 22, fontWeight: 700, 
            background: 'linear-gradient(135deg, #f1f0ff, #a78bfa)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>SignBridge</h1>
          {isDetecting && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div className="recording-dot" style={{ 
                width: 8, height: 8, borderRadius: '50%', background: '#10b981' 
              }} />
              <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>LIVE</span>
            </div>
          )}
        </div>
        <button onClick={exportTranscript} className="btn-secondary" style={{ fontSize: 13, padding: '8px 18px' }}>
          Export Transcript
        </button>
      </nav>

      {/* Main Layout */}
      <div style={{ 
        flex: 1, display: 'grid', 
        gridTemplateColumns: '1fr 380px 260px',
        gap: 16, padding: 16,
        maxWidth: 1400, margin: '0 auto', width: '100%'
      }}>
        {/* Left — Camera + Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Camera Section */}
          <div className="glow-card" style={{ padding: 16 }}>
            <div style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 12
            }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>
                🤟 Deaf User — Signing
              </h2>
              <div style={{
                background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.5)',
                borderRadius: 8, padding: '4px 10px', fontSize: 12, color: 'var(--accent-violet)'
              }}>
                ASL Detection Active
              </div>
            </div>
            <Camera onSignDetected={handleSignDetected} />

            {/* Current word being built */}
            <div style={{ 
              marginTop: 12, padding: '12px 16px',
              background: 'rgba(124,58,237,0.1)', borderRadius: 10,
              border: '1px solid rgba(124,58,237,0.2)',
              minHeight: 48, display: 'flex', alignItems: 'center'
            }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 12, marginRight: 8 }}>Building:</span>
              <span style={{ 
                fontSize: 20, fontWeight: 700, color: 'var(--accent-violet)',
                letterSpacing: 4, fontFamily: 'monospace'
              }}>
                {currentWord || <span style={{ opacity: 0.3, fontSize: 14 }}>Start signing...</span>}
              </span>
            </div>

            <ConfidenceBar confidence={confidence} currentSign={currentSign} />
          </div>

          {/* Avatar Section */}
          <div className="glow-card" style={{ padding: 16, flex: 1 }}>
            <h2 style={{ 
              fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', 
              textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 
            }}>
              🧍 Hearing User's Message — Avatar
            </h2>
            <SignAvatar word={avatarWord} />
          </div>

          {/* Speech Input */}
          <div className="glow-card" style={{ padding: 16 }}>
            <h2 style={{ 
              fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', 
              textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 
            }}>
              🎤 Hearing User — Speak or Type
            </h2>
            <SpeechInput onInput={handleHearingInput} />
          </div>
        </div>

        {/* Center — Chat Panel */}
        <ChatPanel messages={messages} />

        {/* Right — Learning Sidebar */}
        <LearningSidebar signs={learnedSigns} currentSign={currentSign} />
      </div>
    </div>
  )
}
