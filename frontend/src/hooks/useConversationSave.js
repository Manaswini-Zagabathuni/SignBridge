import { useRef, useCallback } from 'react'
import axios from 'axios'

/**
 * Hook to auto-save the conversation to the backend
 * when the user leaves or after a period of inactivity.
 */
export default function useConversationSave() {
  const startTimeRef = useRef(Date.now())
  const signCountRef = useRef(0)

  const incrementSignCount = useCallback(() => {
    signCountRef.current += 1
  }, [])

  const saveConversation = useCallback(async (messages) => {
    const filtered = messages.filter(m => m.sender !== 'system')
    if (filtered.length === 0) return

    const duration = Math.round((Date.now() - startTimeRef.current) / 1000)

    try {
      await axios.post('/api/conversations/', {
        messages: filtered.map(m => ({
          sender: m.sender,
          text: m.text,
          time: m.time
        })),
        duration_seconds: duration,
        sign_count: signCountRef.current
      })
      console.log('✅ Conversation saved')
    } catch (err) {
      console.warn('Could not save conversation (backend may be offline):', err.message)
    }
  }, [])

  return { saveConversation, incrementSignCount }
}
