import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppProvider } from './context/AppContext.tsx';

export const server = import.meta.env.VITE_API_URL ?? "https://career-ai-1xha.onrender.com";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
    
  </StrictMode>,
)
