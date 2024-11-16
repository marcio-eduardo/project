import './global.css'

import { RouterProvider } from 'react-router-dom'
import { AppRouter } from '@/routes/app.routes'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Footer } from './components/footer'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/react-query'

interface FutureConfig { 
  v7_startTransition?: boolean; 
  v7_normalizeFormMethod?: boolean;
}
export function App() {

  const futureConfig: FutureConfig = { 
    v7_startTransition: true, 
    v7_normalizeFormMethod: true, 
  };

  return (
    <HelmetProvider>
      <Helmet /> 
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={AppRouter} future={futureConfig} />  
      </QueryClientProvider>     
      <Footer />
    </HelmetProvider>
  )    
}

