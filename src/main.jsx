import React from 'react'
import { createRoot } from 'react-dom/client'
import RouterApp from './RouterApp'
import { ContentProvider } from './content/ContentProvider'
import './index.css'

function migrateLegacyWordPressHash() {
  if (!window.__SPP_CONTENT_API__ || !window.location.hash.startsWith('#/')) return
  const basePath=new URL(window.__SPP_SITE_URL__||'/',window.location.origin).pathname.replace(/\/+$/,'')
  const route=window.location.hash.slice(1).split('?')[0]||'/'
  window.history.replaceState(null,'',`${basePath}${route}${window.location.search}`)
}

migrateLegacyWordPressHash()

createRoot(document.getElementById('root')).render(
  <React.StrictMode><ContentProvider><RouterApp /></ContentProvider></React.StrictMode>
)
