import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'

export default function History() {
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const res = await axios.get('/api/conversations/')
      setConversations(res.data.data || [])
    } catch (err) {
      setError('Could not load conversations. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/conversations/${id}`)
      setConversations(prev => prev.filter(c => c._id !== id))
    } catch (err) {
      alert('Failed to delete conversation.')
    }
  }

  const formatDate = (iso) => {
    return new Date(iso).toLocaleString([], {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '16px 28px', borderBottom: '1px solid var(--border)',
        background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(10px)',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <button onClick={() => navigate('/')} style={{
          background: 'none', border: 'none', color: 'var(--text-secondary)',
          cursor: 'pointer', fontSize: 18, padding: 4
        }}>←</button>
        <h1 style={{
          fontSize: 20, fontWeight: 700,
          background: 'linear-gradient(135deg, #f1f0ff, #a78bfa)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>Conversation History</h1>
      </nav>

      <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
        {loading && (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 60 }}>
            Loading...
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 12, padding: 20, color: '#ef4444', textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {!loading && !error && conversations.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
            <p>No saved conversations yet.</p>
            <p style={{ fontSize: 13, marginTop: 8 }}>
              Use the Bridge and your conversations will appear here.
            </p>
            <button
              className="btn-primary"
              onClick={() => navigate('/bridge')}
              style={{ marginTop: 24 }}
            >
              Open Bridge
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {conversations.map((convo, i) => (
            <motion.div
              key={convo._id}
              className="glow-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
                  Session — {formatDate(convo.created_at)}
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
                  {convo.sign_count > 0 && <span>🤟 {convo.sign_count} signs</span>}
                  {convo.duration_seconds > 0 && <span>⏱ {Math.round(convo.duration_seconds / 60)}m</span>}
                </div>
              </div>
              <button
                onClick={() => handleDelete(convo._id)}
                style={{
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  color: '#ef4444', borderRadius: 8, padding: '6px 14px',
                  cursor: 'pointer', fontSize: 12, fontWeight: 600
                }}
              >
                Delete
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
