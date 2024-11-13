import './global.css'

import { RouterProvider } from 'react-router-dom'
import { AppRouter } from '@/routes/app.routes'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Footer } from './components/footer'


export function App() {
  return (
    <HelmetProvider>
      <Helmet />      
        <RouterProvider router={AppRouter} />
      <Footer />
    </HelmetProvider>
  )    
}

