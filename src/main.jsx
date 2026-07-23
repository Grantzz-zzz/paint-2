import React from 'react'
import { createRoot } from 'react-dom/client'
import RouterApp from './RouterApp'
import { ContentProvider } from './content/ContentProvider'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode><ContentProvider><RouterApp /></ContentProvider></React.StrictMode>
)
