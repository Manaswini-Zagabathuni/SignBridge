import { motion, AnimatePresence } from 'framer-motion'

export default function ConfidenceBar({ confidence, currentSign }) {
  const pct = Math.round(confidence * 100)
  const color = pct > 80 ? '#10b981' : pct > 60 ? '#f59e0b' : '#ef4444'

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Detected:</span>
          <AnimatePresence mode="wait">
            {currentSign && (
              <motion.span
                key={currentSign}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                style={{ 
                  fontSize: 18, fontWeight: 800, color: 'var(--accent-violet)',
                  fontFamily: 'monospace', minWidth: 28, display: 'inline-block'
                }}
              >
                {currentSign}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{pct}%</span>
      </div>
      <div style={{ 
        height: 6, borderRadius: 3, 
        background: 'rgba(255,255,255,0.08)',
        overflow: 'hidden'
      }}>
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 100 }}
          style={{ height: '100%', borderRadius: 3, background: color }}
        />
      </div>
    </div>
  )
}
