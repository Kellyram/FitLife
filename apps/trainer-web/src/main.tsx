import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'

// Initialize theme from persisted storage before render
const storedTheme = localStorage.getItem('trainer-theme');
if (storedTheme) {
  try {
    const parsed = JSON.parse(storedTheme);
    if (parsed?.state?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) { /* ignore parse errors */ }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
