import { api } from '@/lib/axios';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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

const COMMISSION_RATE = 0.1;

export function AssignServiceForm() {
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [commission, setCommission] = useState<number>(0);
  const [assignedServices, setAssignedServices] = useState<AssignedService[]>([]);
  const [serviceDetails, setServiceDetails] = useState<ServiceDetails | null>(null);

  const fetchAssignedServices = async () => {
    try {
      const response = await api.get('/assign_services');
      if (response.data) {
        setAssignedServices(response.data);
      } else {
        throw new Error("Dados da resposta estão indefinidos");
      }
    } catch (error) {
      console.error("Erro ao buscar serviços atribuídos:", error);
      toast.error("Erro ao atualizar a lista de serviços atribuídos.", { position: "bottom-right" });
    }
  };

  const handleAssignService = async () => {
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

        const service = services.find(s => s._id === selectedService);
        if (service) {
          const price = service.price || 0;
          const calculatedCommission = price * COMMISSION_RATE;
          setCommission(calculatedCommission);
          toast.success(`Comissão calculada: R$ ${calculatedCommission.toFixed(2)}`, { position: 'bottom-right' });
        }
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
        throw new Error("Dados do serviço estão indefinidos");
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes do serviço:', error);
      toast.error('Erro ao buscar detalhes do serviço.', { position: 'bottom-right' });
    }
  };

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
          throw new Error("Dados da resposta estão indefinidos");
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

  return (
    <>
      <Helmet title="Atribuir Serviço" />
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-100">Atribuir Serviço</h1>
      <div className="container mx-auto p-4 bg-blue-50 rounded-lg shadow-lg">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-[200px] mb-4">
            <label htmlFor="service" className="block text-lg font-medium text-gray-700 mb-2">Serviço</label>
            <select
              id="service"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um serviço</option>
              {services.map(service => (
                <option key={service._id} value={service._id}>{service.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px] mb-4">
            <label htmlFor="employee" className="block text-lg font-medium text-gray-700 mb-2">Funcionário</label>
            <select
              id="employee"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um funcionário</option>
              {employees.map(employee => (
                <option key={employee._id} value={employee._id}>{employee.nome}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px] mb-4">
            <label htmlFor="patient" className="block text-lg font-medium text-gray-700 mb-2">Paciente</label>
            <select
              id="patient"
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um paciente</option>
              {patients.map(patient => (
                <option key={patient._id} value={patient._id}>{patient.nome}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px] mb-4 flex items-end">
            <button
              onClick={handleAssignService}
              className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200 shadow-md"
            >
              Atribuir Serviço
            </button>
          </div>
        </div>
        {commission > 0 && (
          <p className="mt-4 text-green-600 font-semibold text-lg text-center">Comissão: R$ {commission.toFixed(2)}</p>
        )}
        <ToastContainer />
        {assignedServices.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-4">Serviços Atribuídos</h3>
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border border-gray-300">Serviço</th>
                  <th className="p-2 border border-gray-300">Funcionário</th>
                  <th className="p-2 border border-gray-300">Preço</th>
                  <th className="p-2 border border-gray-300">Comissão</th>
                  <th className="p-2 border border-gray-300">Data</th>
                  <th className="p-2 border border-gray-300">Paciente</th>
                  <th className="p-2 border border-gray-300">Ações</th>
                </tr>
              </thead>
              <tbody>
                {assignedServices.map(service => (
                  <tr key={service._id}>
                    <td className="p-2 border border-gray-300">{service.name}</td>
                    <td className="p-2 border border-gray-300">{service.employee_name}</td>
                    <td className="p-2 border border-gray-300">{service.price}</td>
                    <td className="p-2 border border-gray-300">{service.commission}</td>
                    <td className="p-2 border border-gray-300">{service.date}</td>
                    <td className="p-2 border border-gray-300">{service.patient_name}</td>
                    <td className="p-2 border border-gray-300">
                      <div className="flex gap-2">
                        <button
                          onClick={() => fetchServiceDetails(service._id)}
                          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
                        >
                          Ver Detalhes
                        </button>
                        <button
                          onClick={() => handleDeleteAssignedService(service._id)}
                          className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
                        >
                          Deletar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {serviceDetails && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Detalhes do Serviço</h3>
            <p><strong>ID:</strong> {serviceDetails.id}</p>
            <p><strong>Nome:</strong> {serviceDetails.name}</p>
            <p><strong>Descrição:</strong> {serviceDetails.description}</p>
            <p><strong>Preço:</strong> R$ {serviceDetails.price.toFixed(2).replace('.', ',')}</p>
            <p><strong>Data:</strong> {serviceDetails.date}</p>
            <p><strong>Funcionário:</strong> {serviceDetails.employee.name}</p>
            <p><strong>Paciente:</strong> {serviceDetails.patient.name}</p>
          </div>
        )}
      </div>
    </>
  );
}

