import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

type EmployeeCommission = {
  name: string;
  commission: number;
};

type ReportGraphProps = {
  data: EmployeeCommission[];
};

const ReportGraph: React.FC<ReportGraphProps> = ({ data }) => {
  return (
    <BarChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="commission" fill="#4f46e5" />
    </BarChart>
  );
};

export default ReportGraph;
