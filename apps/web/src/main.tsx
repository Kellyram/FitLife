import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'
import { useThemeStore } from './store/useThemeStore'

// Initialize theme from persisted storage before render
const storedTheme = localStorage.getItem('theme-storage');
if (storedTheme) {
  try {
    const { state } = JSON.parse(storedTheme);
    if (state?.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    // Default to dark if parsing fails
    document.documentElement.classList.add('dark');
  }
} else {
  // Default to dark
  document.documentElement.classList.add('dark');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
