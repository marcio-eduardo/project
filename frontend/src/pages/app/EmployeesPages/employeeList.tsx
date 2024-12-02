import { api } from '@/lib/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Employee {
  _id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  endereco: string;
  data_nascimento: string;
  date_hired: string;
  funcao: string;
}

// Função para buscar os colaboradores da API
const fetchEmployees = async (): Promise<Employee[]> => {
  const response = await api.get('/employees');
  return response.data;
};

export function EmployeeList() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null); // Armazena o colaborador a ser editado

  // Hook para listar colaboradores
  const { data: employees, isLoading, isError } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  });

  // Mutação para exclusão
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/employees/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] }); // Atualiza a lista
    },
  });

  // Mutação para atualização
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Employee> }) => {
      await api.put(`/employees/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setEditEmployee(null); // Fecha o modal de edição
    },
  });

  // Função para lidar com a pesquisa
  const filteredEmployees = employees?.filter((employee) =>
    employee.nome.toLowerCase().includes(search.toLowerCase()) ||
    employee.email.toLowerCase().includes(search.toLowerCase())
  );

  // Função para exclusão
  const handleDelete = (id: string) => {
    toast(
      ({ closeToast }) => (
        <div>
          Tem certeza que deseja excluir este colaborador?
          <div className="mt-2">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              onClick={() => {
                deleteMutation.mutate(id);
                closeToast();
              }}
            >
              Confirmar
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={closeToast}
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      {
        position: "bottom-right",
        autoClose: false,
        closeOnClick: false,
        draggable: true,
      }
    );
  };

  // Função para abrir o modal de edição
  const handleEdit = (employee: Employee) => {
    setEditEmployee(employee);
  };

  // Função para salvar as alterações
  const handleUpdate = () => {
    toast(
      ({ closeToast }) => (
        <div>
          Tem certeza que deseja atualizar este colaborador?
          <div className="mt-2">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              onClick={() => {
                if (editEmployee) {
                  const { _id, ...data } = editEmployee;
                  updateMutation.mutate({ id: _id, data });
                  closeToast();
                }
              }}
            >
              Confirmar
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={closeToast}
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      {
        position: "bottom-right",
        autoClose: false,
        closeOnClick: false,
        draggable: true,
      }
    );
  };

  if (isLoading) {
    return <div className="text-center text-gray-500">Carregando...</div>;
  }

  if (isError) {
    return <div className="text-center text-red-500">Erro ao carregar os colaboradores.</div>;
  }

  return (
    <>
      <ToastContainer position="bottom-right" />
      <h1 className="text-5xl font-bold mb-6 text-center text-blue-100">Lista de Colaboradores</h1>
      <div className='w-full p-10'>
        <div>
          <div className="w-full px-5 py-4 bg-white rounded-lg shadow-md mt-6">

            {/* Barra de pesquisa */}
            <input
              type="text"
              placeholder="Pesquisar por nome ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Tabela de colaboradores */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-centertable-auto bg-gray-50 shadow-lg">
                <thead>
                  <tr className="bg-blue-500 text-white text-center text-sm">
                    <th className="p-3 text-left">Nome</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">CPF</th>
                    <th className="p-3 text-left">Telefone</th>
                    <th className="p-3 text-left">Função</th>
                    <th className="p-3 text-left">Data de Nascimento</th>
                    <th className="p-3 text-left">Data de Contratação</th>
                    <th className="p-3 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees && filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <tr key={employee._id} className="border-b text-sm hover:bg-gray-100">
                        <td className="p-3">{employee.nome}</td>
                        <td className="p-3">{employee.email}</td>
                        <td className="p-3">{employee.cpf}</td>
                        <td className="p-3">{employee.telefone}</td>
                        <td className="p-3">{employee.funcao}</td>
                        <td className="p-3">{new Date(employee.data_nascimento).toLocaleDateString()}</td>
                        <td className="p-3">{new Date(employee.date_hired).toLocaleDateString()}</td>
                        <td className="p-3 flex gap-2">
                          <button
                            onClick={() => handleEdit(employee)}
                            className="bg-blue-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(employee._id)}
                            className="bg-blue-900 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center p-3 text-gray-500">
                        Nenhum colaborador encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal de edição */}
            {editEmployee && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4">Editar Colaborador</h2>
                  <input
                    type="text"
                    value={editEmployee.nome}
                    onChange={(e) => setEditEmployee({ ...editEmployee, nome: e.target.value })}
                    className="w-full mb-2 p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={editEmployee.email}
                    onChange={(e) => setEditEmployee({ ...editEmployee, email: e.target.value })}
                    className="w-full mb-2 p-2 border border-gray-300 rounded-md"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => setEditEmployee(null)}
                      className="mr-2 bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleUpdate}
                      className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
