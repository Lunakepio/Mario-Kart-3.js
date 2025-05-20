import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.jsx'
import { WebGPUCanvas } from './WebGPUCanvas.jsx'
import { MobileControls } from './mobile/MobileControls.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className='canvas-container'>
      <MobileControls/>
      <WebGPUCanvas />
    </div>
  </StrictMode>,
)
