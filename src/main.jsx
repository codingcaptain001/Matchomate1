import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'
import { HostelProvider } from './context/HostelStore.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <HostelProvider>
        <App />
      </HostelProvider>
    </ThemeProvider>
  </StrictMode>,
)
