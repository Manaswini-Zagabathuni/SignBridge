import { useEffect, useRef, useState } from 'react'
import useHandDetection from '../hooks/useHandDetection'
import useASLModel from '../hooks/useASLModel'

export default function Camera({ onSignDetected }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [error, setError] = useState(null)

  const { detectHands, isReady: handsReady } = useHandDetection(canvasRef)
  const { classify, isReady: modelReady } = useASLModel()

  useEffect(() => {
    startCamera()
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480, facingMode: 'user' } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
          setCameraActive(true)
          startDetectionLoop()
        }
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.')
    }
  }

  const startDetectionLoop = () => {
    let lastPrediction = null
    let sameCount = 0
    const REQUIRED_SAME = 8 // Require sign to be stable for 8 frames

    const loop = async () => {
      if (!videoRef.current || !canvasRef.current) return

      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      // Mirror the video
      ctx.save()
      ctx.scale(-1, 1)
      ctx.drawImage(videoRef.current, -canvas.width, 0, canvas.width, canvas.height)
      ctx.restore()

      // Detect hands and get landmarks
      const landmarks = await detectHands(videoRef.current, ctx)
      
      if (landmarks && modelReady) {
        const result = await classify(landmarks)
        if (result) {
          if (result.letter === lastPrediction) {
            sameCount++
            if (sameCount === REQUIRED_SAME) {
              onSignDetected(result.letter, result.confidence)
            }
          } else {
            lastPrediction = result.letter
            sameCount = 0
          }
        }
      }

      requestAnimationFrame(loop)
    }

    requestAnimationFrame(loop)
  }

  if (error) {
    return (
      <div style={{
        width: '100%', aspectRatio: '4/3',
        background: 'var(--bg-secondary)', borderRadius: 12,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 12, color: 'var(--text-secondary)'
      }}>
        <span style={{ fontSize: 40 }}>📷</span>
        <p style={{ textAlign: 'center', fontSize: 14, maxWidth: 200 }}>{error}</p>
        <button className="btn-primary" onClick={startCamera} style={{ fontSize: 13 }}>
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: 12, overflow: 'hidden' }}>
      <video
        ref={videoRef}
        style={{ display: 'none' }}
        muted
        playsInline
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ 
          width: '100%', height: 'auto',
          borderRadius: 12,
          background: 'var(--bg-secondary)'
        }}
      />
      {!cameraActive && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg-secondary)', borderRadius: 12
        }}>
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
            <p>Starting camera...</p>
          </div>
        </div>
      )}
      {cameraActive && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: 'rgba(16,185,129,0.2)', border: '1px solid #10b981',
          borderRadius: 8, padding: '4px 10px',
          fontSize: 11, color: '#10b981', fontWeight: 700
        }}>
          {handsReady && modelReady ? '● READY' : '◌ LOADING...'}
        </div>
      )}

      {/* Guide overlay */}
      <div style={{
        position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.6)', borderRadius: 8, padding: '4px 12px',
        fontSize: 11, color: 'white', whiteSpace: 'nowrap'
      }}>
        Hold sign steady • Thumbs up = SPACE • ✌️ = DEL
      </div>
    </div>
  )
}
