import { api } from "@/lib/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ReportData {
  start_date: string; // Ajustado para 'data_inicio'
  end_date: string;    // Ajustado para 'data_fim'
}

export function ReportSelect() {
  const [start_date, setStart_date] = useState<string>("");
  const [end_date, setEnd_date] = useState<string>("");
  const navigate = useNavigate();

  // Função para converter de "yyyy-mm-dd" para "dd/mm/yyyy"
  const formatDate = (dateStr: string): string => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita o comportamento padrão do formulário

    // Converter as datas para o formato "dd/mm/yyyy"
    const reportData: ReportData = {
      start_date: formatDate(start_date),
      end_date: formatDate(end_date),
    };

    try {
      // Enviar o relatório
      const response = await api.post("/create_report", reportData);
    
      // Verifica se o relatório foi criado com sucesso
      if (response.data?.report_id) {
        toast.success("Relatório gerado com sucesso!");
        navigate('/report'); // Redireciona para a página do relatório
      } else {
        toast.error("Erro ao gerar relatório. Tente novamente mais tarde.");
      }
    } catch (error: any) {
      // Verifica se há mensagem de erro no backend e exibe
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        // Caso não haja erro específico, exibe uma mensagem genérica
        toast.error("Erro ao gerar relatório. Tente novamente mais tarde.");
      }
    }
  };

  return (
    <div>
      <h3 className="text-xl text-center font-bold mb-4 text-blue-100">Gerar Relatório</h3>
      <div className="w-[540px] h-[540px] rounded-lg flex items-center justify-center bg-blue-100 shadow-xl overflow-hidden">
        <form onSubmit={handleGenerateReport} className="flex flex-row gap-4">
          <div>
            <label
              htmlFor="start_date"
              className="block text-lg text-center font-medium text-blue-900 mb-2"
            >
              Data Início
            </label>
            <input
              type="date"
              id="start_date"
              value={start_date}
              onChange={(e) => setStart_date(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="data_fim"
              className="block text-lg text-center font-medium text-blue-900 mb-2"
            >
              Data Fim
            </label>
            <input
              type="date"
              id="end_date"
              value={end_date}
              onChange={(e) => setEnd_date(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold shadow-xl py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Gerar Relatório
          </button>
        </form>
      </div>
    </div>
  );
}
