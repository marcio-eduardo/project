import './global.css'

import { RouterProvider } from 'react-router-dom'
import { AppRouter } from '@/routes/app.routes'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Footer } from './components/footer'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/react-query'
import { Toaster } from 'sonner'


 export function App() {
  return (
    <HelmetProvider>
      <Helmet  titleTemplate='%s | Dentalis'/> 
      <QueryClientProvider client={queryClient}>
        <Toaster richColors />
        <RouterProvider router={AppRouter} />  
      </QueryClientProvider>     
      <Footer />
    </HelmetProvider>
  )    
}

