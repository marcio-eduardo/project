import { api } from '@/lib/axios';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface Service {
  _id: string;
  name: string;
  price?: number;
}

interface Employee {
  _id: string;
  nome: string;
}

interface Patient {
  _id: string;
  nome: string;
}

interface AssignedService {
  _id: string;
  date: string;
  employee_name: string;
  name: string;
  patient_name: string;
  price: string;
  commission: string;
}

interface ServiceDetails {
  id: string;
  name: string;
  description: string;
  price: number;
  date: string;
  employee: {
    id: string | null;
    name: string | null;
  };
  patient: {
    id: string | null;
    name: string | null;
  };
}

interface ServiceContextProps {
  services: Service[];
  employees: Employee[];
  patients: Patient[];
  assignedServices: AssignedService[];
  serviceDetails: ServiceDetails | null;
  fetchServiceDetails: (service_id: string) => void;
  handleAssignService: (selectedService: string, selectedEmployee: string, selectedPatient: string) => void;
  handleDeleteAssignedService: (serviceId: string) => void;
  calculateCommission: (serviceId: string) => number; // Função para calcular comissão
}

export const ServiceContext = createContext<ServiceContextProps | undefined>(undefined);

interface ServiceProviderType {
  children: ReactNode;
}

export function ServiceProvider({ children }: ServiceProviderType ) {
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [assignedServices, setAssignedServices] = useState<AssignedService[]>([]);
  const [serviceDetails, setServiceDetails] = useState<ServiceDetails | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesResponse, employeesResponse, patientsResponse, assignedServicesResponse] = await Promise.all([
          api.get('/services'),
          api.get('/employees'),
          api.get('/patients'),
          api.get('/assign_services'),
        ]);

        if (servicesResponse.data && employeesResponse.data && patientsResponse.data) {
          setServices(servicesResponse.data);
          setEmployees(employeesResponse.data);
          setPatients(patientsResponse.data);
        } else {
          throw new Error('Dados da resposta estão indefinidos');
        }

        if (assignedServicesResponse.data) {
          setAssignedServices(assignedServicesResponse.data);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        toast.error('Erro ao buscar dados.', { position: 'bottom-right' });
      }
    };

    fetchData();
  }, []);

  const fetchServiceDetails = async (service_id: string) => {
    if (!service_id) {
      toast.error('ID do serviço não definido.', { position: 'bottom-right' });
      return;
    }

    try {
      const response = await api.get(`/services/${service_id}`);
      if (response.data && response.data.service) {
        setServiceDetails(response.data.service);
      } else {
        throw new Error('Dados do serviço estão indefinidos');
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes do serviço:', error);
      toast.error('Erro ao buscar detalhes do serviço.', { position: 'bottom-right' });
    }
  };

  const handleAssignService = async (selectedService: string, selectedEmployee: string, selectedPatient: string) => {
    if (!selectedService || !selectedEmployee || !selectedPatient) {
      toast.error('Por favor, selecione o serviço, funcionário e paciente.', { position: 'bottom-right' });
      return;
    }

    const data = {
      service_id: selectedService,
      employee_id: selectedEmployee,
      patient_id: selectedPatient,
    };

    try {
      const response = await api.post('/assign_service', data);

      if (response.status === 200) {
        toast.success('Serviço atribuído com sucesso!', { position: 'bottom-right' });

        await fetchAssignedServices();

        const commission = calculateCommission(selectedService); // Calcula a comissão
        toast.success(`Comissão calculada: R$ ${commission.toFixed(2)}`, { position: 'bottom-right' });
      } else {
        toast.error('Erro ao atribuir serviço. Tente novamente.', { position: 'bottom-right' });
      }
    } catch (error) {
      console.error('Erro ao atribuir serviço:', error);
      toast.error('Erro ao atribuir serviço. Tente novamente.', { position: 'bottom-right' });
    }
  };

  const handleDeleteAssignedService = async (serviceId: string) => {
    try {
      const response = await api.delete(`/assigned_services/${serviceId}`);

      if (response.status === 200) {
        toast.success('Serviço atribuído deletado com sucesso!', { position: 'bottom-right' });

        await fetchAssignedServices();
      } else {
        toast.error('Erro ao deletar o serviço atribuído.', { position: 'bottom-right' });
      }
    } catch (error) {
      console.error('Erro ao deletar serviço atribuído:', error);
      toast.error('Erro ao deletar o serviço atribuído.', { position: 'bottom-right' });
    }
  };

  const fetchAssignedServices = async () => {
    try {
      const response = await api.get('/assign_services');
      if (response.data) {
        setAssignedServices(response.data);
      } else {
        throw new Error('Dados da resposta estão indefinidos');
      }
    } catch (error) {
      console.error('Erro ao buscar serviços atribuídos:', error);
      toast.error('Erro ao atualizar a lista de serviços atribuídos.', { position: 'bottom-right' });
    }
  };

  const calculateCommission = (serviceId: string): number => {
    const service = services.find((s) => s._id === serviceId);
    if (!service || !service.price) return 0;
    return service.price * 0.1; // 10% de comissão
  };

  return (
    <ServiceContext.Provider
      value={{
        services,
        employees,
        patients,
        assignedServices,
        serviceDetails,
        fetchServiceDetails,
        handleAssignService,
        handleDeleteAssignedService,
        calculateCommission, // Incluído no contexto
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
}
