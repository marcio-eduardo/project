import { useEffect, useState } from 'react';

import { api } from '@/lib/axios';

interface Patient {
  _id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  endereco: string;
}

export function PatientsTable() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Função para buscar os dados dos pacientes do backend
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get('/patients');
        setPatients(response.data);
      } catch (err) {
        console.error('Erro ao buscar pacientes:', err);
        setError('Erro ao carregar os dados dos pacientes. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Lista de Pacientes</h2>

      {loading ? (
        <p className="text-center text-gray-600">Carregando...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : patients.length === 0 ? (
        <p className="text-center text-gray-600">Nenhum paciente encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">Nome</th>
                <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">Email</th>
                <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">CPF</th>
                <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">Telefone</th>
                <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">Endereço</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient._id} className="hover:bg-gray-50">
                  <td
                    className="border border-gray-300 px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis"
                    title={patient.nome} // Tooltip
                  >
                    {patient.nome}
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis"
                    title={patient.email} // Tooltip
                  >
                    {patient.email}
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis"
                    title={patient.cpf} // Tooltip
                  >
                    {patient.cpf}
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis"
                    title={patient.telefone} // Tooltip
                  >
                    {patient.telefone}
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis"
                    title={patient.endereco} // Tooltip
                  >
                    {patient.endereco}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
