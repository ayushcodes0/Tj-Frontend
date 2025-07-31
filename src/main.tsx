import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/variable.css'
import './styles/base.css'
import App from './App.tsx'
import { AuthProvider } from './providers/authProvider.tsx'
import { ToastProvider } from './providers/toastProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider/>
      <App />
    </AuthProvider>
  </StrictMode>,
)
