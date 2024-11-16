// import React, { useEffect, useState } from "react";
// // import api from "@services/api";
// // import ReportTable from "@components/ReportTable";
// // import ReportGraph from "@components/ReportGraph";

// type EmployeeCommission = {
//   id: number;
//   name: string;
//   serviceCount: number;
//   commission: number;
// };

// const ReportPage: React.FC = () => {
//   const [data, setData] = useState<EmployeeCommission[]>([]);

//   useEffect(() => {
//     async function fetchCommissions() {
//       try {
//         const response = await api.get("/commissions");
//         setData(response.data);
//       } catch (error) {
//         console.error("Erro ao carregar comissões:", error);
//       }
//     }
//     fetchCommissions();
//   }, []);

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-semibold mb-6">Relatório de Comissões</h1>
//       <ReportGraph data={data.map((item) => ({ name: item.name, commission: item.commission }))} />
//       <ReportTable data={data} />
//     </div>
//   );
// };

// export default ReportPage;
