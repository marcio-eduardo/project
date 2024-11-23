
import { NotLoggedInPage } from '@/auth/notLogged';
import { SignInPage } from '@/auth/signInPage';
import { SignUp } from '@/auth/signUp';
import { PrivateRoute } from '@/contexts/userContext';
import { AppLayout } from '@/pages/_layouts/app';
import { HomeLayout } from '@/pages/_layouts/home';
import { AuthLayout } from '@/pages/_layouts/signIn';
import { Dashboard } from '@/pages/app/dashboard';
import { EmployeeRegister } from '@/pages/app/employee-register';
import { Homepage } from '@/pages/app/homepage';
import { PatientRegister } from '@/pages/app/patient-register';
import { PatientsTable } from '@/pages/app/patient-table';
import { ServiceRegister } from '@/pages/app/service-register';
import { ServicesList } from '@/pages/app/services';
import { createBrowserRouter } from 'react-router-dom';

export const AppRouter = createBrowserRouter([
  
  /*---------- SignIn ----------*/
  { 
    path: '/',
    element: <HomeLayout />, 
    children: [
      { path: '/', element: <Homepage /> },
      { path: 'not-logged', element: <NotLoggedInPage />}
      
    ]
  },
  { 
    path: '/', 
    element: <AuthLayout />, 
    children: [
      { path: '/signin', element: <SignInPage /> },
      { path: '/signup', element: <SignUp /> }
    ],  
  },   
  { 
    path: '/',
    element:
      <PrivateRoute>
        <AppLayout />
      </PrivateRoute>,       
    children: [
      { 
        path: '/dashboard', 
        element:
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
      },
      { 
        path: '/service-register', 
        element:
        <PrivateRoute>
          <ServiceRegister /> 
        </PrivateRoute>        
      },
      { path: 
        '/employee-register', 
        element:
        <PrivateRoute>
          <EmployeeRegister />
        </PrivateRoute>         
      },
      { path: 
        '/patient-register', 
        element: 
        <PrivateRoute>
          <PatientRegister />
        </PrivateRoute> 
      },
      { path: 
        '/patient-table', 
        element: 
        <PrivateRoute>
          <PatientsTable />
        </PrivateRoute>
      },
      { path: 
        '/services', 
        element: 
        <PrivateRoute>
          <ServicesList />
        </PrivateRoute> },
    ]
  }, 
],
)