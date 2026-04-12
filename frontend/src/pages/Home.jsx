import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const features = [
  {
    icon: '🤟',
    title: 'Sign → Text',
    desc: 'Camera reads ASL hand signs and converts them to text and speech in real-time.'
  },
  {
    icon: '💬',
    title: 'Text → Sign Avatar',
    desc: 'Type or speak and a 3D avatar performs the corresponding sign language.'
  },
  {
    icon: '📊',
    title: 'Confidence Score',
    desc: 'See exactly how confident the AI model is with each sign detected.'
  },
  {
    icon: '📖',
    title: 'Learn As You Go',
    desc: 'A live sidebar shows every sign used, helping hearing users learn ASL passively.'
  },
  {
    icon: '💾',
    title: 'Save Conversations',
    desc: 'Full conversation history saved and exportable as a transcript.'
  },
  {
    icon: '🎤',
    title: 'Voice Input',
    desc: 'Hearing users can speak naturally — no typing required.'
  }
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Hero */}
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background glow blobs */}
        <div style={{
          position: 'absolute', top: '20%', left: '10%',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)', zIndex: 0
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '10%',
          width: 350, height: 350,
          background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)', zIndex: 0
        }} />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: 700 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.4)',
            borderRadius: 100, padding: '6px 18px', marginBottom: 28,
            fontSize: 13, color: 'var(--accent-violet)', fontWeight: 600
          }}>
            <span>🤟</span> Real-time Bidirectional Sign Language
          </div>

          <h1 style={{
            fontSize: 'clamp(48px, 8vw, 80px)',
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 24,
            background: 'linear-gradient(135deg, #f1f0ff 0%, #a78bfa 50%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Sign<span style={{ color: 'var(--accent-cyan)', WebkitTextFillColor: 'var(--accent-cyan)' }}>Bridge</span>
          </h1>

          <p style={{
            fontSize: 20, color: 'var(--text-secondary)', lineHeight: 1.7,
            marginBottom: 40, maxWidth: 520, margin: '0 auto 40px'
          }}>
            The first two-way sign language communication platform. 
            Deaf and hearing users can communicate naturally — no interpreter needed.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="btn-primary"
              onClick={() => navigate('/bridge')}
              style={{ fontSize: 16, padding: '14px 36px' }}
            >
              Open SignBridge →
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="btn-secondary"
              href="https://github.com/YOUR_USERNAME/signbridge"
              target="_blank"
              style={{ fontSize: 16, padding: '14px 36px', textDecoration: 'none', display: 'inline-block' }}
            >
              ⭐ GitHub
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="btn-secondary"
              onClick={() => navigate('/history')}
              style={{ fontSize: 16, padding: '14px 36px' }}
            >
              💬 History
            </motion.button>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            display: 'flex', gap: 48, marginTop: 72,
            position: 'relative', zIndex: 1, flexWrap: 'wrap', justifyContent: 'center'
          }}
        >
          {[['26+', 'ASL Signs'], ['Real-time', 'Detection'], ['Two-way', 'Communication'], ['0ms', 'Server Latency*']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent-violet)' }}>{val}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </motion.div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 11, marginTop: 8, position: 'relative', zIndex: 1 }}>
          *ASL recognition runs fully in-browser via TensorFlow.js
        </p>
      </div>

      {/* Features Grid */}
      <div style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          style={{ textAlign: 'center', fontSize: 36, fontWeight: 700, marginBottom: 16 }}
        >
          Everything you need to communicate
        </motion.h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 56, fontSize: 17 }}>
          Built for accessibility. Powered by AI.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="glow-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              style={{ padding: 28 }}
            >
              <div style={{ fontSize: 36, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: 14 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '60px 20px 80px' }}>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
          className="btn-primary"
          onClick={() => navigate('/bridge')}
          style={{ fontSize: 18, padding: '16px 48px' }}
        >
          Start Communicating 🤟
        </motion.button>
      </div>

      {/* Footer */}
      <div style={{ 
        borderTop: '1px solid var(--border)', 
        padding: '24px 40px',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: 13
      }}>
        Built by Manaswini Zagabathuni · Indiana University Bloomington · MS Computer Science
      </div>
    </div>
  )
}
