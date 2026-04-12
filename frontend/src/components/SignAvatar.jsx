import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SIGN_EMOJIS = {
  'HELLO': '👋',
  'YES': '✅',
  'NO': '❌',
  'THANK YOU': '🙏',
  'PLEASE': '🤲',
  'HELP': '🆘',
  'SORRY': '😔',
  'LOVE': '❤️',
  'GOOD': '👍',
  'BAD': '👎',
}

// A visual signing avatar using CSS animations
// Replace with a real 3D avatar (Ready Player Me / Three.js) for production
export default function SignAvatar({ word }) {
  const [displayWord, setDisplayWord] = useState('')
  const [letterIndex, setLetterIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!word) return
    
    setIsAnimating(true)
    setDisplayWord('')
    setLetterIndex(0)

    // Animate letter by letter
    const letters = word.toUpperCase().split('')
    let i = 0

    const animate = () => {
      if (i < letters.length) {
        setLetterIndex(i)
        setDisplayWord(letters.slice(0, i + 1).join(''))
        i++
        intervalRef.current = setTimeout(animate, 400)
      } else {
        setIsAnimating(false)
      }
    }

    animate()
    return () => clearTimeout(intervalRef.current)
  }, [word])

  const currentLetter = word ? word.toUpperCase()[letterIndex] : ''
  const emoji = SIGN_EMOJIS[word?.toUpperCase()] || null

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: 240, gap: 16
    }}>
      {/* Avatar silhouette */}
      <div style={{ position: 'relative' }}>
        <motion.div
          animate={isAnimating ? { y: [0, -5, 0] } : {}}
          transition={{ repeat: Infinity, duration: 0.8 }}
          style={{
            width: 100, height: 120,
            position: 'relative'
          }}
        >
          {/* Head */}
          <div style={{
            width: 50, height: 50, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(6,182,212,0.3))',
            border: '2px solid rgba(124,58,237,0.6)',
            margin: '0 auto', position: 'relative'
          }}>
            <div style={{
              position: 'absolute', top: 16, left: 10,
              display: 'flex', gap: 8
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-violet)' }} />
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-violet)' }} />
            </div>
            <div style={{
              position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
              width: 16, height: 4, borderRadius: 2, background: 'rgba(124,58,237,0.5)'
            }} />
          </div>

          {/* Body */}
          <div style={{
            width: 60, height: 50, margin: '4px auto 0',
            background: 'linear-gradient(180deg, rgba(124,58,237,0.3), rgba(124,58,237,0.1))',
            border: '2px solid rgba(124,58,237,0.4)',
            borderRadius: 12, position: 'relative'
          }}>
            {/* Arms */}
            <motion.div
              animate={isAnimating ? { rotate: [-10, 10, -10], x: [-5, 5, -5] } : { rotate: 0 }}
              transition={{ repeat: Infinity, duration: 0.4 }}
              style={{
                position: 'absolute', left: -20, top: 8,
                width: 18, height: 8, borderRadius: 4,
                background: 'rgba(124,58,237,0.5)',
                transformOrigin: 'right center'
              }}
            >
              {/* Hand */}
              <div style={{
                position: 'absolute', left: -12, top: -4,
                width: 16, height: 16, borderRadius: '50%',
                background: 'rgba(6,182,212,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10
              }}>
                {isAnimating ? '✋' : '🤚'}
              </div>
            </motion.div>
            
            <motion.div
              animate={isAnimating ? { rotate: [10, -10, 10], x: [5, -5, 5] } : { rotate: 0 }}
              transition={{ repeat: Infinity, duration: 0.4 }}
              style={{
                position: 'absolute', right: -20, top: 8,
                width: 18, height: 8, borderRadius: 4,
                background: 'rgba(124,58,237,0.5)',
                transformOrigin: 'left center'
              }}
            >
              <div style={{
                position: 'absolute', right: -12, top: -4,
                width: 16, height: 16, borderRadius: '50%',
                background: 'rgba(6,182,212,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10
              }}>
                {isAnimating ? '🤟' : '🤚'}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Current letter being signed */}
      <AnimatePresence mode="wait">
        {displayWord ? (
          <motion.div
            key={displayWord}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
              {isAnimating ? 'Signing letter by letter...' : 'Signed:'}
            </div>
            {emoji ? (
              <div style={{ fontSize: 40 }}>{emoji}</div>
            ) : (
              <div style={{
                fontSize: 32, fontWeight: 800, letterSpacing: 6,
                color: 'var(--accent-violet)', fontFamily: 'monospace'
              }}>
                {displayWord}
              </div>
            )}
            {isAnimating && (
              <div style={{
                marginTop: 8, fontSize: 48,
                filter: 'drop-shadow(0 0 8px rgba(124,58,237,0.8))'
              }}>
                {currentLetter === 'A' ? '🤜' :
                 currentLetter === 'B' ? '✋' :
                 currentLetter === 'C' ? '🤏' :
                 currentLetter === 'L' ? '🤙' :
                 currentLetter === 'V' ? '✌️' :
                 currentLetter === 'Y' ? '🤙' : '🤟'}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>🧍</div>
            Waiting for hearing user's message...
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{
        fontSize: 11, color: 'var(--text-secondary)', textAlign: 'center',
        background: 'rgba(124,58,237,0.08)', borderRadius: 8, padding: '6px 12px'
      }}>
        💡 Upgrade to 3D avatar: integrate Ready Player Me + Three.js
      </div>
    </div>
  )
}
