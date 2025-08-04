import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/variable.css'
import './styles/base.css'
import App from './App.tsx'
import { AuthProvider } from './providers/authProvider.tsx'
import { ToastProvider } from './providers/toastProvider.tsx'
import { TradesProvider } from './providers/tradeProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider/>
      <TradesProvider><App /></TradesProvider>
    </AuthProvider>
  </StrictMode>,
)
