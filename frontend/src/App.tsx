import './global.css'

import { QueryClientProvider } from '@tanstack/react-query'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { UserProvider } from './auth/signInPage'
import { Footer } from './components/footer'
import { queryClient } from './lib/react-query'
import { AppRouter } from './routes/app.routes'



//export const UserToken = createContext({} as TokenInStorageType)
 export function App() {
  return (
    <HelmetProvider>
      <Helmet  titleTemplate='%s | Dentalis'/> 
      <QueryClientProvider client={queryClient}>
        <Toaster richColors />
          <UserProvider>       
            <RouterProvider router={AppRouter} />                  
          </UserProvider>
      </QueryClientProvider>     
      <Footer />
    </HelmetProvider>
  )    
}

