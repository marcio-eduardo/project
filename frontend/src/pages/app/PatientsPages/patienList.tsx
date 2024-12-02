// import { api } from '@/lib/axios';
// import { useEffect, useState } from 'react';

// interface Patient {
//   _id: string;
//   nome: string;
//   email: string;
//   cpf: string;
//   telefone: string;
//   endereco: string;
// }

// export function PatientsList() {
//   const [patients, setPatients] = useState<Patient[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [editPatient, setEditPatient] = useState<Patient | null>(null);

//   // Função para buscar os dados dos pacientes do backend
//   useEffect(() => {
//     const fetchPatients = async () => {
//       try {
//         const response = await api.get('/patients');
//         setPatients(response.data);
//       } catch (err) {
//         console.error('Erro ao buscar pacientes:', err);
//         setError('Erro ao carregar os dados dos pacientes. Tente novamente mais tarde.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPatients();
//   }, []);

//   // Função para excluir um paciente
//   const handleDeletePatient = async (patientId: string) => {
//     try {
//       await api.delete(`/patients/${patientId}`);
//       setPatients(patients.filter(patient => patient._id !== patientId));
//       alert('Paciente deletado com sucesso');
//     } catch (err) {
//       console.error('Erro ao excluir paciente:', err);
//       alert('Erro ao excluir paciente. Tente novamente.');
//     }
//   };

//   const handleUpdatePatient = async (updatedPatient: Patient) => {
//     try {
//       // Envia os dados de atualização sem o campo _id
//       const { _id, ...dataToUpdate } = updatedPatient;
//       await api.put(`/patients/${updatedPatient._id}`, dataToUpdate);
//       setPatients(patients.map(patient => patient._id === updatedPatient._id ? updatedPatient : patient));
//       setEditPatient(null);
//       alert('Paciente atualizado com sucesso');
//     } catch (err) {
//       console.error('Erro ao atualizar paciente:', err);
//       alert('Erro ao atualizar paciente. Tente novamente.');
//     }
//   };

//   return (
//     <>
//       <div className='w-full p-10'>
//         <h2 className="text-2xl font-bold text-center mb-6 text-blue-100">Lista de Pacientes</h2>
//         <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg">

//           {loading ? (
//             <p className="text-center text-gray-600">Carregando...</p>
//           ) : error ? (
//             <p className="text-center text-red-500">{error}</p>
//           ) : patients.length === 0 ? (
//             <p className="text-center text-gray-600">Nenhum paciente encontrado.</p>
//           ) : (
//             <div className="overflow-hidden">
//               <table className="w-full table-auto border-collapse border border-gray-300">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">Nome</th>
//                     <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">Email</th>
//                     <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">CPF</th>
//                     <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">Telefone</th>
//                     <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">Endereço</th>
//                     <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">Ações</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {patients.map((patient) => (
//                     <tr key={patient._id} className="hover:bg-gray-50">
//                       <td className="border border-gray-300 px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis" title={patient.nome}>
//                         {patient.nome}
//                       </td>
//                       <td className="border border-gray-300 px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis" title={patient.email}>
//                         {patient.email}
//                       </td>
//                       <td className="border border-gray-300 px-4 py-2 whitespace-nowrap max-w-[5rem] overflow-hidden text-ellipsis" title={patient.cpf}>
//                         {patient.cpf}
//                       </td>
//                       <td className="border border-gray-300 px-4 py-2 whitespace-nowrap max-w-[5rem] overflow-hidden text-ellipsis" title={patient.telefone}>
//                         {patient.telefone}
//                       </td>
//                       <td className="border border-gray-300 px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis" title={patient.endereco}>
//                         {patient.endereco}
//                       </td>
//                       <td className="border border-gray-300 px-4 py-2 max-w-[5rem] whitespace-nowrap">
//                         <button
//                           className="bg-blue-500 hover:bg-yellow-500 text-white px-4 py-2 rounded mr-2"
//                           onClick={() => setEditPatient(patient)}
//                         >
//                           Editar
//                         </button>
//                         <button
//                           className="bg-blue-900 hover:bg-red-600 bg-red-500 text-white px-4 py-2 rounded"
//                           onClick={() => handleDeletePatient(patient._id)}
//                         >
//                           Excluir
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Formulário de edição do paciente */}
//       {editPatient && (
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h3 className="text-xl font-semibold mb-4">Editar Paciente</h3>
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 if (editPatient) handleUpdatePatient(editPatient);
//               }}
//             >
//               <div className="mb-4">
//                 <label className="block text-sm font-medium">Nome</label>
//                 <input
//                   type="text"
//                   className="w-full p-2 border border-gray-300 rounded"
//                   value={editPatient.nome}
//                   onChange={(e) => setEditPatient({ ...editPatient, nome: e.target.value })}
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium">Email</label>
//                 <input
//                   type="email"
//                   className="w-full p-2 border border-gray-300 rounded"
//                   value={editPatient.email}
//                   onChange={(e) => setEditPatient({ ...editPatient, email: e.target.value })}
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium">CPF</label>
//                 <input
//                   type="text"
//                   className="w-full p-2 border border-gray-300 rounded"
//                   value={editPatient.cpf}
//                   onChange={(e) => setEditPatient({ ...editPatient, cpf: e.target.value })}
//                   maxLength={14} // Limite para CPF (xxx.xxx.xxx-xx)
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium">Telefone</label>
//                 <input
//                   type="text"
//                   className="w-full p-2 border border-gray-300 rounded"
//                   value={editPatient.telefone}
//                   onChange={(e) => setEditPatient({ ...editPatient, telefone: e.target.value })}
//                   maxLength={15} // Limite para telefone (xx) xxxxx-xxxx
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium">Endereço</label>
//                 <input
//                   type="text"
//                   className="w-full p-2 border border-gray-300 rounded"
//                   value={editPatient.endereco}
//                   onChange={(e) => setEditPatient({ ...editPatient, endereco: e.target.value })}
//                 />
//               </div>
//               <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mr-2">
//                 Atualizar
//               </button>
//               <button
//                 type="button"
//                 className="bg-gray-500 text-white px-4 py-2 rounded"
//                 onClick={() => setEditPatient(null)}
//               >
//                 Cancelar
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


import { api } from '@/lib/axios';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Patient {
  _id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  endereco: string;
}

export function PatientsList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [editPatient, setEditPatient] = useState<Patient | null>(null);

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

  // Função para excluir um paciente
  const handleDeletePatient = async (patientId: string) => {
    toast(
      ({ closeToast }) => (
        <div>
          Você tem certeza que deseja excluir este paciente?
          <div className="mt-2">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              onClick={async () => {
                try {
                  await api.delete(`/patients/${patientId}`);
                  setPatients(patients.filter(patient => patient._id !== patientId));
                  toast.success('Paciente deletado com sucesso', { position: "bottom-right" });
                } catch (err) {
                  console.error('Erro ao excluir paciente:', err);
                  toast.error('Erro ao excluir paciente. Tente novamente.', { position: "bottom-right" });
                } finally {
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

  // Função para atualizar um paciente
  const handleUpdatePatient = async (updatedPatient: Patient) => {
    toast(
      ({ closeToast }) => (
        <div>
          Você tem certeza que deseja atualizar este paciente?
          <div className="mt-2">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              onClick={async () => {
                try {
                  // Envia os dados de atualização sem o campo _id
                  const { _id, ...dataToUpdate } = updatedPatient;
                  await api.put(`/patients/${updatedPatient._id}`, dataToUpdate);
                  setPatients(patients.map(patient => patient._id === updatedPatient._id ? updatedPatient : patient));
                  setEditPatient(null);
                  toast.success('Paciente atualizado com sucesso', { position: "bottom-right" });
                } catch (err) {
                  console.error('Erro ao atualizar paciente:', err);
                  toast.error('Erro ao atualizar paciente. Tente novamente.', { position: "bottom-right" });
                } finally {
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

  return (
    <>
      <ToastContainer position="bottom-right" />
      <div className='w-full p-10'>
        <h1 className="text-5xl font-bold text-center mb-6 text-blue-100">Lista de Pacientes</h1>
        <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
          {loading ? (
            <p className="text-center text-gray-600">Carregando...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : patients.length === 0 ? (
            <p className="text-center text-gray-600">Nenhum paciente encontrado.</p>
          ) : (
            <div className="overflow-hidden">
              <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">Nome</th>
                    <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">Email</th>
                    <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">CPF</th>
                    <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">Telefone</th>
                    <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">Endereço</th>
                    <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis" title={patient.nome}>
                        {patient.nome}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis" title={patient.email}>
                        {patient.email}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 whitespace-nowrap max-w-[5rem] overflow-hidden text-ellipsis" title={patient.cpf}>
                        {patient.cpf}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 whitespace-nowrap max-w-[5rem] overflow-hidden text-ellipsis" title={patient.telefone}>
                        {patient.telefone}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis" title={patient.endereco}>
                        {patient.endereco}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 max-w-[5rem] whitespace-nowrap">
                        <button
                          className="bg-blue-500 hover:bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                          onClick={() => setEditPatient(patient)}
                        >
                          Editar
                        </button>
                        <button
                          className="bg-blue-900 hover:bg-red-600 bg-red-500 text-white px-4 py-2 rounded"
                          onClick={() => handleDeletePatient(patient._id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    

      {/* Formulário de edição do paciente */}
      {editPatient && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Editar Paciente</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editPatient) handleUpdatePatient(editPatient);
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium">Nome</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={editPatient.nome}
                  onChange={(e) => setEditPatient({ ...editPatient, nome: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={editPatient.email}
                  onChange={(e) => setEditPatient({ ...editPatient, email: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">CPF</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={editPatient.cpf}
                  onChange={(e) => setEditPatient({ ...editPatient, cpf: e.target.value })}
                  maxLength={14} // Limite para CPF (xxx.xxx.xxx-xx)
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Telefone</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={editPatient.telefone}
                  onChange={(e) => setEditPatient({ ...editPatient, telefone: e.target.value })}
                  maxLength={15} // Limite para telefone (xx) xxxxx-xxxx
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Endereço</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={editPatient.endereco}
                  onChange={(e) => setEditPatient({ ...editPatient, endereco: e.target.value })}
                />
              </div>
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mr-2">
                Atualizar
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setEditPatient(null)}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
