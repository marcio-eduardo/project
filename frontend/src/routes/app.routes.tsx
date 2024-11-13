import { createBrowserRouter } from 'react-router-dom';
import { Login } from '../pages/auth/login';
import { AuthLayout } from '../pages/_layouts/auth';
import { Homepage } from '../pages/app/homepage';
import { SignUpLayout } from '../pages/_layouts/signup';
import { ServiceRegisterLayout } from '../pages/_layouts/service-register';
import ServiceRegister from '../pages/app/service-register';
import { PatientRegisterLayout } from '../pages/_layouts/patient-register';
import PatientRegister from '../pages/app/patient-register';
import { EmployeeRegisterLayout } from '../pages/_layouts/employee-register';
import EmployeeRegister from '../pages/app/employee-register';
import { HomeLayout } from '../pages/_layouts/home';
import { SignUp } from '../pages/app/signup';


export const AppRouter = createBrowserRouter([
  { 
    path: '/login', 
    element: <AuthLayout />, 
    children: [
      { path: '/login', element: <Login /> }
    ]
  },
  { 
    path: '/',
    element: <HomeLayout />, 
    children: [
      { path: '/', element: <Homepage /> }
    ]
  },
  { 
    path: '/register',
    element: <SignUpLayout />, 
    children: [
      { path: '/register', element: <SignUp /> }
    ]
  },
  { 
    path: '/service-register',
    element: <ServiceRegisterLayout />, 
    children: [
      { path: '/service-register', element: <ServiceRegister /> },
    ]
  },
  { 
    path: '/patient-register',
    element: <PatientRegisterLayout />, 
    children: [
      { path: '/patient-register', element: <PatientRegister /> }
    ]
  },
  { 
    path: '/employee-register',
    element: <EmployeeRegisterLayout />, 
    children: [
      { path: '/employee-register', element: <EmployeeRegister /> }
    ]
  },
])