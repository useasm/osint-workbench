import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// External links (resource cards = <a target="_blank">) are opened in the system
// browser: in Tauri via the opener plugin, on the web via plain window.open.
const isTauri = '__TAURI_INTERNALS__' in window
document.addEventListener(
  'click',
  (e) => {
    const anchor = (e.target as HTMLElement | null)?.closest?.('a[target="_blank"]') as
      | HTMLAnchorElement
      | null
    if (!anchor || !/^https?:\/\//i.test(anchor.href)) return
    e.preventDefault()
    if (isTauri) {
      import('@tauri-apps/plugin-opener')
        .then((m) => m.openUrl(anchor.href))
        .catch(() => window.open(anchor.href, '_blank', 'noopener,noreferrer'))
    } else {
      window.open(anchor.href, '_blank', 'noopener,noreferrer')
    }
  },
  true,
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
