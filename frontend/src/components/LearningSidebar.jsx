import { motion, AnimatePresence } from 'framer-motion'
import { ASL_DESCRIPTIONS } from '../utils/signMappings'

export default function LearningSidebar({ signs, currentSign }) {
  return (
    <div className="glow-card" style={{ 
      display: 'flex', flexDirection: 'column',
      height: '100%', overflow: 'hidden'
    }}>
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ 
          fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)',
          textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4
        }}>
          📖 Learn ASL
        </h2>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
          Signs used in this session
        </p>
      </div>

      {/* Current sign highlight */}
      <AnimatePresence>
        {currentSign && ASL_DESCRIPTIONS[currentSign] && (
          <motion.div
            key={currentSign}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              margin: 12, padding: 14,
              background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))',
              border: '1px solid rgba(124,58,237,0.4)',
              borderRadius: 12
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-violet)', marginBottom: 4 }}>
              {currentSign}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {ASL_DESCRIPTIONS[currentSign]}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Signs seen this session */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 12px' }}>
        {signs.length === 0 ? (
          <div style={{ 
            textAlign: 'center', padding: '32px 16px',
            color: 'var(--text-secondary)', fontSize: 13
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🤟</div>
            Signs you use will appear here
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {signs.map((sign, i) => (
              <motion.div
                key={sign.letter}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  padding: '10px 12px',
                  background: 'var(--bg-secondary)',
                  borderRadius: 10, border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', gap: 10
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: 'rgba(124,58,237,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 16, color: 'var(--accent-violet)',
                  flexShrink: 0
                }}>
                  {sign.letter.length === 1 ? sign.letter : sign.letter[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>
                    {sign.letter}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', 
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {ASL_DESCRIPTIONS[sign.letter] || 'Common ASL sign'}
                  </div>
                </div>
                <div style={{
                  fontSize: 11, color: 'var(--accent-violet)',
                  background: 'rgba(124,58,237,0.1)',
                  borderRadius: 6, padding: '2px 7px', fontWeight: 600
                }}>
                  ×{sign.count}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div style={{ padding: 12, borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600 }}>
          GESTURES
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[['👍', 'SPACE — adds word'], ['✌️', 'DEL — backspace']].map(([icon, label]) => (
            <div key={label} style={{ 
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 11, color: 'var(--text-secondary)'
            }}>
              <span style={{ fontSize: 16 }}>{icon}</span> {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
