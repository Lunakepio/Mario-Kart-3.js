import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { HUD } from './HUD'
import { Landing } from './Landing'
import { useStore } from './components/store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <HUD />
    <Landing />
  </React.StrictMode>,
)
