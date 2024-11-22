import './global.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import { AuthProvider } from './hooks/auth.tsx'
import { App } from './app.tsx'

//import { MyContext } from './hooks/auth.tsx'

createRoot(document.getElementById('root')!).render(
 
  <StrictMode>   
      <App />     
  </StrictMode>,
)
