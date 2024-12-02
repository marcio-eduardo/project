// import { api } from "@/lib/axios";
// import React, { useEffect, useState } from "react";
// import { Column, Row, useTable } from "react-table";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// interface Service {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
// }

// export function ServicesList() {
//   const [services, setServices] = useState<Service[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [editService, setEditService] = useState<Service | null>(null);

//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         const response = await api.get("/services");
//         if (Array.isArray(response.data)) {
//           setServices(response.data);
//         } else if (response.data.services && Array.isArray(response.data.services)) {
//           setServices(response.data.services);
//         } else {
//           throw new Error("Formato inesperado da resposta da API.");
//         }
//         setError(null);
//       } catch (err) {
//         console.error("Erro ao buscar serviços:", err);
//         setError("Não foi possível carregar os serviços.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchServices();
//   }, []);

//   const handleDeleteService = (serviceId: string) => {
//     toast(
//       ({ closeToast }) => (
//         <div>
//           Tem certeza que deseja excluir este serviço?
//           <div className="mt-2">
//             <button
//               className="bg-red-500 text-white px-4 py-2 rounded mb-2"
//               onClick={async () => {
//                 try {
//                   await api.delete(`/services/${serviceId}`);
//                   setServices(services.filter(service => service._id !== serviceId));
//                   toast.success("Serviço deletado com sucesso", { position: "bottom-right" });
//                 } catch (err) {
//                   console.error("Erro ao excluir serviço:", err);
//                   toast.error("Erro ao excluir serviço. Tente novamente.", { position: "bottom-right" });
//                 } finally {
//                   closeToast();
//                 }
//               }}
//             >
//               Confirmar
//             </button>
//             <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={closeToast}>
//               Cancelar
//             </button>
//           </div>
//         </div>
//       ),
//       {
//         position: "bottom-right",
//         autoClose: false,
//         closeOnClick: false,
//         draggable: true,
//       }
//     );
//   };

//   const handleUpdateService = async () => {
//     if (editService) {
//       toast(
//         ({ closeToast }) => (
//           <div>
//             Tem certeza que deseja atualizar este serviço?
//             <div className="mt-2">
//               <button
//                 className="bg-green-500 text-white px-4 py-2 rounded mb-2"
//                 onClick={async () => {
//                   try {
//                     const { _id, ...dataToUpdate } = editService;
//                     await api.put(`/services/${_id}`, dataToUpdate);
//                     setServices((prevServices) =>
//                       prevServices.map((service) =>
//                         service._id === _id ? editService : service
//                       )
//                     );
//                     setEditService(null);  // Limpa a edição após a atualização
//                     toast.success("Serviço atualizado com sucesso", { position: "bottom-right" });
//                   } catch (err) {
//                     console.error("Erro ao atualizar serviço:", err);
//                     toast.error("Erro ao atualizar serviço. Tente novamente.", { position: "bottom-right" });
//                   } finally {
//                     closeToast();
//                   }
//                 }}
//               >
//                 Confirmar
//               </button>
//               <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={closeToast}>
//                 Cancelar
//               </button>
//             </div>
//           </div>
//         ),
//         {
//           position: "bottom-right",
//           autoClose: false,
//           closeOnClick: false,
//           draggable: true,
//         }
//       );
//     }
//   };

//   const data = React.useMemo(() => services, [services]);

//   const columns: Column<Service>[] = React.useMemo(
//     () => [
//       {
//         Header: "Nome",
//         accessor: "name",
//       },
//       {
//         Header: "Descrição",
//         accessor: "description",
//       },
//       {
//         Header: "Preço",
//         accessor: "price",
//         Cell: ({ value }: { value: number }) => {
//           return `R$ ${value.toFixed(2)}`;
//         },
//       },
//       {
//         Header: "Ações",
//         accessor: "_id",
//         Cell: ({ row }: { row: Row<Service> }) => (
//           <div className="flex justify-center">
//             <button
//               className="bg-blue-400 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-500"
//               onClick={() => setEditService(row.original)}
//             >
//               Editar
//             </button>
//             <button
//               className="bg-blue-900 text-white px-3 py-1 rounded hover:bg-red-600"
//               onClick={() => handleDeleteService(row.original._id)}
//             >
//               Excluir
//             </button>
//           </div>
//         ),
//       },
//     ],
//     [services]
//   );

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     rows,
//     prepareRow,
//   } = useTable({ columns, data });

//   if (loading) return <div className="text-center mt-10">Carregando...</div>;
//   if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

//   return (
//     <div className="max-w-screen-lg mx-auto p-6">
//       <ToastContainer position="bottom-right" />
//       <h1 className="text-3xl font-bold text-center text-blue-100 mb-8">Lista de Serviços</h1>
//       {services.length === 0 ? (
//         <p className="text-center text-gray-600">Nenhum serviço disponível no momento.</p>
//       ) : (
//         <table {...getTableProps()} className="min-w-full bg-white">
//           <thead>
//             {headerGroups.map(headerGroup => (
//               <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-200">
//                 {headerGroup.headers.map(column => (
//                   <th
//                     {...column.getHeaderProps()}
//                     className="px-6 py-3 border-b border-gray-300 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider"
//                   >
//                     {column.render("Header")}
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody {...getTableBodyProps()}>
//             {rows.map(row => {
//               prepareRow(row);
//               return (
//                 <tr {...row.getRowProps()} className="even:bg-gray-100">
//                   {row.cells.map(cell => (
//                     <td
//                       {...cell.getCellProps()}
//                       className="px-6 py-4 border-b border-gray-300 whitespace-no-wrap"
//                     >
//                       {cell.render("Cell")}
//                     </td>
//                   ))}
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       )}
//       {editService && (
//         <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
//             <h2 className="text-xl font-bold mb-4">Editar Serviço</h2>
//             <input
//               type="text"
//               value={editService.name}
//               onChange={(e) => setEditService({ ...editService, name: e.target.value })}
//               className="w-full mb-2 p-2 border border-gray-300 rounded-md"
//             />
//             <input
//               type="text"
//               value={editService.description}
//               onChange={(e) => setEditService({ ...editService, description: e.target.value })}
//               className="w-full mb-2 p-2 border border-gray-300 rounded-md"
//             />
//             <input
//               type="number"
//               value={editService.price}
//               onChange={(e) => setEditService({ ...editService, price: Number(e.target.value) })}
//               className="w-full mb-2 p-2 border border-gray-300 rounded-md"
//             />
//             <div className="flex justify-end">
//               <button
//                 onClick={() => setEditService(null)}
//                 className="mr-2 bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
//               >
//                 Cancelar
//               </button>
//               <button
//                 onClick={handleUpdateService}
//                 className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
//               >
//                 Salvar
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import { api } from "@/lib/axios";
import React, { useEffect, useState } from "react";
import { Column, Row, useTable } from "react-table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
}

interface Employee {
  _id: string;
  name: string;
}

interface Patient {
  _id: string;
  name: string;
}

export function ServicesList() {
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editService, setEditService] = useState<Service | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services");
        setServices(response.data);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar serviços:", err);
        setError("Não foi possível carregar os serviços.");
      } finally {
        setLoading(false);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await api.get("/employees");
        setEmployees(response.data);
      } catch (err) {
        console.error("Erro ao buscar funcionários:", err);
      }
    };

    const fetchPatients = async () => {
      try {
        const response = await api.get("/patients");
        setPatients(response.data);
      } catch (err) {
        console.error("Erro ao buscar pacientes:", err);
      }
    };

    fetchServices();
    fetchEmployees();
    fetchPatients();
  }, []);

  const handleAssignService = async () => {
    if (editService && selectedEmployee && selectedPatient) {
      try {
        // Enviando dados para a API
        const response = await api.post("/assign_service", {
          service_id: editService._id,
          employee_id: selectedEmployee,
          patient_id: selectedPatient,
        });
  
        // Verifique o conteúdo da resposta no console
        console.log("Resposta da API:", response);
  
        // Se a resposta for bem-sucedida
        if (response.status === 200) {
          toast.success("Serviço atribuído com sucesso!", { position: "bottom-right" });
          setEditService(null); // Fecha o modal após a atribuição
        } else {
          toast.error("Erro ao atribuir serviço. Código de status: " + response.status, { position: "bottom-right" });
        }
      } catch (err) {
        // Imprimindo o erro completo para depuração
        console.error("Erro ao atribuir serviço:", err);
        toast.error("Erro ao atribuir serviço. Tente novamente.", { position: "bottom-right" });
      }
    } else {
      toast.error("Por favor, selecione um funcionário e um paciente.", { position: "bottom-right" });
    }
  };

  const handleDeleteService = (serviceId: string) => {
        toast(
          ({ closeToast }) => (
            <div>
              Tem certeza que deseja excluir este serviço?
              <div className="mt-2">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded mb-2"
                  onClick={async () => {
                    try {
                      await api.delete(`/services/${serviceId}`);
                      setServices(services.filter(service => service._id !== serviceId));
                      toast.success("Serviço deletado com sucesso", { position: "bottom-right" });
                    } catch (err) {
                      console.error("Erro ao excluir serviço:", err);
                      toast.error("Erro ao excluir serviço. Tente novamente.", { position: "bottom-right" });
                    } finally {
                      closeToast();
                    }
                  }}
                >
                  Confirmar
                </button>
                <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={closeToast}>
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

  const data = React.useMemo(() => services, [services]);

  const columns: Column<Service>[] = React.useMemo(
    () => [
      {
        Header: "Nome",
        accessor: "name",
      },
      {
        Header: "Descrição",
        accessor: "description",
      },
      {
        Header: "Preço",
        accessor: "price",
        Cell: ({ value }: { value: number }) => {
          return `R$ ${value.toFixed(2)}`;
        },
      },
      {
        Header: "Ações",
        accessor: "_id",
        Cell: ({ row }: { row: Row<Service> }) => (
          <div className="flex justify-center">
            <button
              className="bg-blue-400 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-500"
              onClick={() => setEditService(row.original)}
            >
              Editar
            </button>
            <button
              className="bg-blue-900 text-white px-3 py-1 rounded hover:bg-red-600"
              onClick={() => handleDeleteService(row.original._id)}
            >
              Excluir
            </button>
          </div>
        ),
      },
    ],
    [services]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  if (loading) return <div className="text-center mt-10">Carregando...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="max-w-screen-lg mx-auto p-6">
      <ToastContainer position="bottom-right" />
      <h1 className="text-3xl font-bold text-center text-blue-100 mb-8">Lista de Serviços</h1>
      {services.length === 0 ? (
        <p className="text-center text-gray-600">Nenhum serviço disponível no momento.</p>
      ) : (
        <table {...getTableProps()} className="min-w-full bg-white">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-200">
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps()}
                    className="px-6 py-3 border-b border-gray-300 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider"
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps({ key: row.original._id })} className="even:bg-gray-100">
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 border-b border-gray-300 whitespace-no-wrap"
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {editService && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Editar Serviço</h2>
            <input
              type="text"
              value={editService.name}
              onChange={(e) => setEditService({ ...editService, name: e.target.value })}
              className="w-full mb-2 p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={editService.description}
              onChange={(e) => setEditService({ ...editService, description: e.target.value })}
              className="w-full mb-2 p-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              value={editService.price}
              onChange={(e) => setEditService({ ...editService, price: Number(e.target.value) })}
              className="w-full mb-2 p-2 border border-gray-300 rounded-md"
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Funcionário</label>
              <select
                value={selectedEmployee || ""}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full mb-2 p-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecione um Funcionário</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Paciente</label>
              <select
                value={selectedPatient || ""}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="w-full mb-2 p-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecione um Paciente</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setEditService(null)}
                className="mr-2 bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleAssignService}
                className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
              >
                Atribuir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
