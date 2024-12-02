import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  date: string;
  employee: { id: string | null, name: string | null };
  patient: { id: string | null, name: string | null };
}

interface Employee {
  id: string;
  name: string;
}

interface Patient {
  id: string;
  name: string;
}

const ServiceDetails: React.FC = () => {
  const { service_id } = useParams<{ service_id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [commission, setCommission] = useState<number>(0);

  useEffect(() => {
    axios.get(`/services/${service_id}`)
      .then(response => setService(response.data.service))
      .catch(error => {
        console.error('Erro ao buscar detalhes do serviço:', error);
        toast.error('Erro ao buscar detalhes do serviço');
      });

    axios.get('/employees')
      .then(response => setEmployees(response.data.employees))
      .catch(error => console.error('Erro ao buscar funcionários:', error));

    axios.get('/patients')
      .then(response => setPatients(response.data.patients))
      .catch(error => console.error('Erro ao buscar pacientes:', error));
  }, [service_id]);

  const handleAssign = () => {
    if (!selectedEmployee || !selectedPatient) {
      toast.error('Por favor, selecione um funcionário e um paciente');
      return;
    }

    axios.post('/assign_service', {
      service_id: service_id,
      employee_id: selectedEmployee,
      patient_id: selectedPatient
    })
      .then(response => {
        toast.success('Serviço atribuído com sucesso!');
        setService({
          ...service!,
          employee: employees.find(e => e.id === selectedEmployee)!,
          patient: patients.find(p => p.id === selectedPatient)!
        });
        setCommission(response.data.comissao);
      })
      .catch(error => {
        console.error('Erro ao atribuir serviço:', error);
        toast.error('Erro ao atribuir serviço');
      });
  };

  if (!service) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{service.name}</h1>
      <p><strong>Descrição:</strong> {service.description}</p>
      <p><strong>Preço:</strong> {service.price}</p>
      <p><strong>Data:</strong> {new Date(service.date).toLocaleDateString()}</p>
      <p><strong>Funcionário:</strong> {service.employee.name}</p>
      <p><strong>Paciente:</strong> {service.patient.name}</p>

      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Atribuir Serviço</h2>
        <div className="mb-2">
          <label htmlFor="employee" className="block text-sm font-medium text-gray-700">Funcionário</label>
          <select id="employee" value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
            <option value="">Selecione um funcionário</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>{employee.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label htmlFor="patient" className="block text-sm font-medium text-gray-700">Paciente</label>
          <select id="patient" value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
            <option value="">Selecione um paciente</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>{patient.name}</option>
            ))}
          </select>
        </div>
        <button onClick={handleAssign} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Atribuir</button>
        {commission > 0 && (
          <p className="mt-2 text-green-500">Comissão: R$ {commission.toFixed(2)}</p>
        )}
      </div>
    </div>
  );
};

export default ServiceDetails;
