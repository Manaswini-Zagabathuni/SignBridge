import { useRef, useState, useEffect } from 'react'

export default function useHandDetection(canvasRef) {
  const handsRef = useRef(null)
  const [isReady, setIsReady] = useState(false)
  const landmarksRef = useRef(null)

  useEffect(() => {
    const loadMediaPipe = async () => {
      try {
        // Load MediaPipe Hands dynamically
        const { Hands } = await import('@mediapipe/hands')
        const { drawConnectors, drawLandmarks } = await import('@mediapipe/drawing_utils')
        const { HAND_CONNECTIONS } = await import('@mediapipe/hands')

        const hands = new Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        })

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.6
        })

        hands.onResults((results) => {
          if (!canvasRef.current) return
          const ctx = canvasRef.current.getContext('2d')

          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0]
            landmarksRef.current = landmarks

            // Draw landmarks
            drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
              color: 'rgba(124, 58, 237, 0.8)', lineWidth: 2
            })
            drawLandmarks(ctx, landmarks, {
              color: 'rgba(139, 92, 246, 1)',
              fillColor: 'rgba(6, 182, 212, 0.8)',
              lineWidth: 1,
              radius: 4
            })
          } else {
            landmarksRef.current = null
          }
        })

        handsRef.current = { hands, drawConnectors, drawLandmarks, HAND_CONNECTIONS }
        setIsReady(true)
      } catch (err) {
        console.error('Failed to load MediaPipe:', err)
      }
    }

    loadMediaPipe()
  }, [])

  const detectHands = async (videoElement, ctx) => {
    if (!handsRef.current || !isReady) return null
    try {
      await handsRef.current.hands.send({ image: videoElement })
      return landmarksRef.current
    } catch (e) {
      return null
    }
  }

  return { detectHands, isReady }
}
