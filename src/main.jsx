import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.jsx'
import { WebGPUCanvas } from './WebGPUCanvas.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className='canvas-container'>
      <WebGPUCanvas />
    </div>
  </StrictMode>,
)
