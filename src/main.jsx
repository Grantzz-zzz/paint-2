import React from 'react'
import { createRoot } from 'react-dom/client'
import RouterApp from './RouterApp'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode><RouterApp /></React.StrictMode>
)
