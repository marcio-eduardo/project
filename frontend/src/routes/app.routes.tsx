import { createBrowserRouter } from 'react-router-dom';

import { Homepage } from '@/pages/app/homepage';
import { HomeLayout } from '@/pages/_layouts/home';
import { ServiceRegister } from '@/pages/app/service-register';
import { PatientRegister } from '@/pages/app/patient-register';
import { EmployeeRegister } from '@/pages/app/employee-register';
import { SignUp } from '@/auth/signUp';
import { AuthLayout } from '@/pages/_layouts/signIn';
import { SignIn } from '@/auth/signIn';
import { Dashboard } from '@/pages/app/dashboard'
import { ServicesList } from '@/pages/app/services';
import { PatientsTable } from '@/pages/app/patient-table';
import { AppLayout } from '@/pages/_layouts/app';

export const AppRouter = createBrowserRouter([
  
  /*---------- SignIn ----------*/
  { 
    path: '/',
    element: <HomeLayout />, 
    children: [
      { path: '/', element: <Homepage /> },
      
    ]
  },
  { 
    path: '/', 
    element: <AuthLayout />, 
    children: [
      { path: '/signin', element: <SignIn /> },
      { path: '/signup', element: <SignUp /> }
    ],  
  },
  { 
    path: '/',
    element: <AppLayout />, 
    children: [
      { path: '/dashboard', element: <Dashboard />},
      { path: '/service-register', element: <ServiceRegister /> },
      { path: '/employee-register', element: <EmployeeRegister /> },
      { path: '/patient-register', element: <PatientRegister /> },
      { path: '/patient-table', element: <PatientsTable />},
      { path: '/services', element: <ServicesList /> },
    ]
  },  
],
)