import { NotLoggedInPage } from '@/auth/notLogged';
import { SignInPage } from '@/auth/signInPage';
import { SignUp } from '@/auth/signUp';
import ReportForm from '@/components/reportForm';
import { PrivateRoute } from '@/contexts/userContext';
import { AppLayout } from '@/pages/_layouts/app';
import { HomeLayout } from '@/pages/_layouts/home';
import { AuthLayout } from '@/pages/_layouts/signIn';
import { Dashboard } from '@/pages/app/dashboard';
import { EmployeeList } from '@/pages/app/EmployeesPages/employeeList';
import { EmployeeRegister } from '@/pages/app/EmployeesPages/employeeRegister';
import { Homepage } from '@/pages/app/homepage';
import { PatientsList } from '@/pages/app/PatientsPages/patienList';
import { PatientRegister } from '@/pages/app/PatientsPages/patient-register';
import { ReportPage } from '@/pages/app/ReportPages/reportPage';
import { ReportSelect } from '@/pages/app/ReportPages/reportSelect';
import { AssignServiceForm } from '@/pages/app/ServicesPages/assignServiceForm';
import { ServiceRegister } from '@/pages/app/ServicesPages/service-register';
import ServiceDetails from '@/pages/app/ServicesPages/serviceDetails';
import { ServicesList } from '@/pages/app/ServicesPages/services';


import { createBrowserRouter } from 'react-router-dom';

export const AppRouter = createBrowserRouter([
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
      { path: 'signin', element: <SignInPage /> },
      { path: 'signup', element: <SignUp /> }
    ]
  },
  { 
    path: '/',
    element: 
      <PrivateRoute>
        <AppLayout />
      </PrivateRoute>,       
    children: [
      { 
        path: 'dashboard', 
        element:
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
      },
      { 
        path: 'service-register', 
        element:
        <PrivateRoute>
          <ServiceRegister /> 
        </PrivateRoute>        
      },
      { 
        path: 'employee-register', 
        element:
        <PrivateRoute>
          <EmployeeRegister />
        </PrivateRoute>         
      },
      { 
        path: 'employee-list', 
        element:
        <PrivateRoute>
          <EmployeeList />
        </PrivateRoute>         
      },
      { 
        path: 'patient-list', 
        element: 
        <PrivateRoute>
          <PatientsList />
        </PrivateRoute>
      },
      { 
        path: 'patient-register', 
        element: 
        <PrivateRoute>
          <PatientRegister />
        </PrivateRoute>
      },
      { 
        path: 'services', 
        element: 
        <PrivateRoute>
          <ServicesList />
        </PrivateRoute> 
      },
      { 
        path: 'assign-service', 
        element: 
        <PrivateRoute>         
          <AssignServiceForm />
        </PrivateRoute> 
      },
      { 
        path: 'services-details/:service_id', 
        element: 
        <PrivateRoute>
          <ServiceDetails />
        </PrivateRoute> 
      },
      { 
        path: 'report/:service_id', 
        element: 
        <PrivateRoute>
          <ReportForm />
        </PrivateRoute> 
      },
      { 
        path: '/report-select', 
        element: 
        <PrivateRoute>
          <ReportSelect />
        </PrivateRoute> 
      },
      { 
        path: '/report', 
        element: 
        <PrivateRoute>
          <ReportPage />
        </PrivateRoute> 
      },
    ]
  }
]);
