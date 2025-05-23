import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { WebGPUCanvas } from './WebGPUCanvas.jsx'
import { MobileControls } from './mobile/MobileControls.jsx'
import { LoadingScreen } from './LoadingScreen.jsx'

createRoot(document.getElementById('root')).render(

    <div className='canvas-container'>
      <MobileControls/>
      <Suspense fallback={<div className="loading-screen">Loading...</div>}>
      <WebGPUCanvas />
      </Suspense>
      {/* <LoadingScreen /> */}
    </div>
)
