import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { authStore, installAuthenticatedFetch } from './Components/Utils/auth'

installAuthenticatedFetch()

const root = createRoot(document.getElementById('root')!)

const renderApp = () => root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)

const startBdcrm = async () => {
  const code = new URLSearchParams(window.location.search).get('code')
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
    if (!response.ok || !payload.access || !payload.refresh || !payload.user) throw new Error(payload.detail || 'BDCRM could not complete sign-in. Please try again.')
    authStore.setSession(payload.access, payload.refresh, {
      ...payload.user,
      company: payload.company,
      app_access: Array.isArray(payload.app_access)
        ? payload.app_access.filter((item: unknown): item is string => typeof item === 'string')
        : [],
      is_portal_admin: payload.is_portal_admin === true,
    })
    window.location.replace('/dashboard')
  } catch (reason) {
    const params = new URLSearchParams({ open: 'bdcrm' })
    window.history.replaceState(null, '', window.location.pathname)
    root.render(<main style={{ maxWidth: 480, margin: '80px auto', padding: 28 }}>
      <h1>Unable to open BDCRM</h1>
      <p role="alert">{reason instanceof Error ? reason.message : 'Unable to complete sign-in.'}</p>
      <a href={`${getNexusOneLoginUrl()}?${params}`}>Try signing in to BDCRM again</a>
    </main>)
  }
}

void startBdcrm()
import { getNexusOneLoginUrl } from './config/portal';
