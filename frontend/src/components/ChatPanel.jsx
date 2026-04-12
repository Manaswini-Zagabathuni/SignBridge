import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ChatPanel({ messages }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="glow-card" style={{ 
      display: 'flex', flexDirection: 'column',
      height: '100%', overflow: 'hidden'
    }}>
      <div style={{ 
        padding: '16px 16px 12px',
        borderBottom: '1px solid var(--border)'
      }}>
        <h2 style={{ 
          fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)',
          textTransform: 'uppercase', letterSpacing: 1
        }}>
          💬 Conversation
        </h2>
      </div>

      <div style={{ 
        flex: 1, overflowY: 'auto', padding: 16,
        display: 'flex', flexDirection: 'column', gap: 12
      }}>
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'hearing' ? 'flex-end' 
                  : msg.sender === 'system' ? 'center' 
                  : 'flex-start'
              }}
            >
              {msg.sender === 'system' ? (
                <div style={{
                  background: 'rgba(124,58,237,0.1)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  borderRadius: 10, padding: '6px 14px',
                  fontSize: 12, color: 'var(--accent-violet)',
                  textAlign: 'center'
                }}>
                  {msg.text}
                </div>
              ) : (
                <>
                  <div style={{
                    fontSize: 10, color: 'var(--text-secondary)', 
                    marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6
                  }}>
                    {msg.sender === 'deaf' ? '🤟 Deaf User' : '🎤 Hearing User'}
                    <span>{formatTime(msg.time)}</span>
                  </div>
                  <div style={{
                    maxWidth: '85%', padding: '10px 14px', borderRadius: 14,
                    fontSize: 15, lineHeight: 1.5, fontWeight: 500,
                    background: msg.sender === 'deaf' 
                      ? 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(139,92,246,0.2))'
                      : 'linear-gradient(135deg, rgba(6,182,212,0.3), rgba(6,182,212,0.15))',
                    border: `1px solid ${msg.sender === 'deaf' 
                      ? 'rgba(124,58,237,0.4)' 
                      : 'rgba(6,182,212,0.4)'}`,
                    color: 'var(--text-primary)',
                    borderBottomLeftRadius: msg.sender === 'deaf' ? 4 : 14,
                    borderBottomRightRadius: msg.sender === 'hearing' ? 4 : 14,
                  }}>
                    {msg.text}
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border)',
        display: 'flex', gap: 16, justifyContent: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(124,58,237,0.6)' }} />
          Deaf User
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(6,182,212,0.6)' }} />
          Hearing User
        </div>
      </div>
    </div>
  )
}
