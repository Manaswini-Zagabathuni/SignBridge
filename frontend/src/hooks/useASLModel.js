import { useRef, useState, useEffect } from 'react'
import * as tf from '@tensorflow/tfjs'
import { normalizeLandmarks } from '../utils/landmarkUtils'

// ASL classes: A-Z + SPACE + DEL
const CLASSES = [
  'A','B','C','D','E','F','G','H','I','J',
  'K','L','M','N','O','P','Q','R','S','T',
  'U','V','W','X','Y','Z','SPACE','DEL'
]

export default function useASLModel() {
  const modelRef = useRef(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    loadModel()
  }, [])

  const loadModel = async () => {
    try {
      // Try loading a pre-trained model from public folder
      // You need to place model.json + weights in /public/model/
      const model = await tf.loadLayersModel('/model/model.json')
      modelRef.current = model
      setIsReady(true)
      console.log('✅ ASL Model loaded from /public/model/')
    } catch (err) {
      console.warn('No pre-trained model found, using demo mode:', err.message)
      // Create a simple demo model for testing the UI
      const model = buildDemoModel()
      await model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy' })
      modelRef.current = model
      setIsReady(true)
    }
  }

  const buildDemoModel = () => {
    const model = tf.sequential()
    model.add(tf.layers.dense({ inputShape: [63], units: 128, activation: 'relu' }))
    model.add(tf.layers.dropout({ rate: 0.3 }))
    model.add(tf.layers.dense({ units: 64, activation: 'relu' }))
    model.add(tf.layers.dropout({ rate: 0.2 }))
    model.add(tf.layers.dense({ units: 32, activation: 'relu' }))
    model.add(tf.layers.dense({ units: CLASSES.length, activation: 'softmax' }))
    return model
  }

  const classify = async (landmarks) => {
    if (!modelRef.current || !landmarks) return null

    try {
      const normalized = normalizeLandmarks(landmarks)
      const inputTensor = tf.tensor2d([normalized])
      const prediction = modelRef.current.predict(inputTensor)
      const probabilities = await prediction.data()
      inputTensor.dispose()
      prediction.dispose()

      const maxIdx = probabilities.indexOf(Math.max(...probabilities))
      const confidence = probabilities[maxIdx]

      return {
        letter: CLASSES[maxIdx],
        confidence: confidence,
        allProbs: Array.from(probabilities)
      }
    } catch (err) {
      return null
    }
  }

  return { classify, isReady, classes: CLASSES }
}
