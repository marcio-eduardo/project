import { createBrowserRouter } from 'react-router-dom';
import { Homepage } from '../pages/app/homepage';
import { HomeLayout } from '../pages/_layouts/home';
import { ServiceRegisterLayout } from '../pages/_layouts/service-register';
import { ServiceRegister } from '../pages/app/service-register';
import { PatientRegister } from '../pages/app/patient-register';
import EmployeeRegister from '../pages/app/employee-register';
import { SignUp } from '@/auth/signup';
import { AuthLayout } from '@/pages/_layouts/signIn';
import { SignIn } from '@/auth/signIn';
import { Dashboard } from '@/pages/app/dashboard'
import { ServicesList } from '@/pages/app/services';
import { PatientsTable } from '@/pages/app/patient-table';

export const AppRouter = createBrowserRouter([
  
  /*---------- SignIn ----------*/
  { 
    path: '/', 
    element: <AuthLayout />, 
    children: [
      { path: '/signin', element: <SignIn /> },
      { path: '/signup', element: <SignUp />}
    ],  
  },
  /*---------- Home ----------*/
  { 
    path: '/',
    element: <HomeLayout />, 
    children: [
      { path: '/homepage', element: <Homepage /> },
      
    ]
  },
  /*---------- Service-register ----------*/
  { 
    path: '/',
    element: <ServiceRegisterLayout />, 
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