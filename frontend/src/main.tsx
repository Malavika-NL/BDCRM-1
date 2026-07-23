import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { authStore } from './Components/Utils/auth.ts'

const root = createRoot(document.getElementById('root')!)
const portalUrl = import.meta.env.VITE_COMPANY_PORTAL_URL || 'http://127.0.0.1:5176'

const showStatus = (message: string) => root.render(
  <div className="min-h-screen grid place-items-center">{message}</div>,
)

const startApp = async () => {
  const code = new URLSearchParams(window.location.search).get('sso_code')
  if (code) {
    showStatus('Opening BDCRM...')
    try {
      const response = await fetch('/api/auth/company-portal-login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await response.json().catch(() => ({}))
      if (response.ok && data.access && data.refresh && data.user && data.company) {
        authStore.setSession(data.access, data.refresh, data.user)
        window.location.replace('/')
        return
      }
    } catch {
      // The portal remains the only place where credentials are entered.
    }
    window.location.replace(portalUrl)
    return
  }

  if (!authStore.isAuthenticated()) {
    window.location.replace(portalUrl)
    return
  }

  const { default: App } = await import('./App.tsx')
  root.render(<StrictMode><App /></StrictMode>)
}

void startApp()
