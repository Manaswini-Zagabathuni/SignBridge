/**
 * Normalize 21 MediaPipe hand landmarks to a 63-element feature vector.
 * Normalization is relative to the wrist (landmark 0) to be
 * position and scale invariant.
 */
export function normalizeLandmarks(landmarks) {
  if (!landmarks || landmarks.length === 0) return new Array(63).fill(0)

  const wrist = landmarks[0]
  
  // Subtract wrist position
  const relative = landmarks.map(lm => ({
    x: lm.x - wrist.x,
    y: lm.y - wrist.y,
    z: lm.z - wrist.z
  }))

  // Find max distance for scale normalization
  const maxDist = Math.max(...relative.map(lm => 
    Math.sqrt(lm.x ** 2 + lm.y ** 2 + lm.z ** 2)
  )) || 1

  // Flatten and normalize
  const features = []
  for (const lm of relative) {
    features.push(lm.x / maxDist, lm.y / maxDist, lm.z / maxDist)
  }

  return features  // length = 21 * 3 = 63
}

/**
 * Extract only x,y coordinates (42 features) — alternative for 2D models
 */
export function extractXY(landmarks) {
  const wrist = landmarks[0]
  const features = []
  for (const lm of landmarks) {
    features.push(lm.x - wrist.x, lm.y - wrist.y)
  }
  return features  // length = 42
}

/**
 * Calculate angle between three landmark points
 */
export function angleBetween(a, b, c) {
  const ab = { x: a.x - b.x, y: a.y - b.y }
  const cb = { x: c.x - b.x, y: c.y - b.y }
  const dot = ab.x * cb.x + ab.y * cb.y
  const magAB = Math.sqrt(ab.x ** 2 + ab.y ** 2)
  const magCB = Math.sqrt(cb.x ** 2 + cb.y ** 2)
  if (magAB === 0 || magCB === 0) return 0
  return Math.acos(Math.min(1, Math.max(-1, dot / (magAB * magCB)))) * (180 / Math.PI)
}
