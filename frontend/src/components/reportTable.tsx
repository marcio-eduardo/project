import React from "react";

type EmployeeCommission = {
  id: number;
  name: string;
  serviceCount: number;
  commission: number;
};

type ReportTableProps = {
  data: EmployeeCommission[];
};

const ReportTable: React.FC<ReportTableProps> = ({ data }) => {
  return (
    <table className="min-w-full bg-white border border-gray-200 shadow-md">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-600">Funcionário</th>
          <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-600">Serviços</th>
          <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-600">Comissão</th>
        </tr>
      </thead>
      <tbody>
        {data.map((employee) => (
          <tr key={employee.id}>
            <td className="px-6 py-4 border-b text-gray-700">{employee.name}</td>
            <td className="px-6 py-4 border-b text-gray-700">{employee.serviceCount}</td>
            <td className="px-6 py-4 border-b text-gray-700">R$ {employee.commission.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ReportTable;
