import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Bridge from './pages/Bridge'
import History from './pages/History'
import './styles/globals.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bridge" element={<Bridge />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  )
}

export default App
