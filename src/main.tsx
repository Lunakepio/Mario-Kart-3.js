import React from 'react'
import App from './App'
import './index.css'
import { HUD } from './HUD'
import { Landing } from './Landing'

import { createRoot } from 'react-dom/client'

const container = document.getElementById('app')
const root = createRoot(container!)

root.render(
  <React.StrictMode>
    <App />
    <HUD />
    <Landing />
  </React.StrictMode>
)
