import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { authStore } from './Components/Utils/auth'

const root = createRoot(document.getElementById('root')!)
const portalUrl = import.meta.env.VITE_COMPANY_PORTAL_URL || 'http://192.168.1.56:8002'

const renderApp = () => root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)

const startBdcrm = async () => {
  const code = new URLSearchParams(window.location.search).get('sso_code')
  if (!code) {
    renderApp()
    return
  }

  root.render(<div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>Opening BDCRM…</div>)
  try {
    const response = await fetch('/api/auth/company-portal-login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok || !payload.access || !payload.refresh || !payload.user) throw new Error('Portal sign-in was rejected.')
    authStore.setSession(payload.access, payload.refresh, payload.user)
    window.location.replace('/dashboard')
  } catch {
    window.location.replace(portalUrl)
  }
}

void startBdcrm()
