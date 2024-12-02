import { api } from '@/lib/axios';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

// Definindo a interface do relatório
interface Report {
  id: string;
  data_geracao: string;
  data_inicio: string;
  data_fim: string;
  total_receita: number;
  pacientes_atendidos: number;
  servicos: {
    servico_nome: string;
    quantidade: number;
    preco_unitario: number;
    total_receita: number;
  }[];
}

// Função para formatar datas no formato dd/mm/yyyy - HH:MM
const formatToBrazilTime = (dateString: string | null | undefined) => {
  if (!dateString) {
    return 'Data inválida';
  }

  try {
    // O backend deve enviar o horário no formato ISO ou "dd/mm/yyyy - HH:MM"
    const [datePart, timePart] = dateString.split(' - ');
    if (datePart && timePart) {
      return `${datePart} - ${timePart}`;
    }

    // Se estiver em formato ISO (fallback)
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Intl.DateTimeFormat('pt-BR', options).format(date);
  } catch (error) {
    console.error(`Erro ao formatar a data: ${dateString}`, error);
    return 'Data inválida';
  }
};

export function ReportPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/get_reports');
      if (Array.isArray(response.data)) {
        setReports(response.data);
      } else {
        throw new Error('Dados recebidos não são uma array.');
      }
    } catch (error) {
      toast.error('Erro ao carregar os relatórios.');
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (reportId: string) => {
    try {
      const response = await api.delete(`/reports/${reportId}`);
      if (response.status === 200) {
        setReports((prevReports) => prevReports.filter((report) => report.id !== reportId));
        toast.success('Relatório deletado com sucesso!');
      }
    } catch (error) {
      toast.error('Erro ao deletar o relatório.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Relatórios</h1>
      <Toaster />
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          {reports.length === 0 ? (
            <p>Nenhum relatório encontrado.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {reports.map((report) => {
                // Calcular o total de receita somando todas as receitas dos atendimentos
                const totalReceita = report.servicos.reduce((acc, servico) => acc + servico.total_receita, 0);

                return (
                  <div key={report.id} className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold">Relatório ID: {report.id}</h2>
                    <p>Data de Geração: {formatToBrazilTime(report.data_geracao)}</p>
                    <p>Data de Início: {(report.data_inicio)}</p>
                    <p>Data de Fim: {(report.data_fim)}</p>
                    <p>Total Receita: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalReceita)}</p>
                    <p>Pacientes Atendidos: {report.pacientes_atendidos}</p>
                    <h3 className="text-lg font-semibold mt-2">Serviços:</h3>

                    <table className="min-w-full table-auto">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 border">Serviço</th>
                          <th className="px-4 py-2 border">Quantidade</th>
                          <th className="px-4 py-2 border">Preço Unitário</th>
                          <th className="px-4 py-2 border">Receita dos Atendimentos</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.servicos.map((servico, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 border">{servico.servico_nome}</td>
                            <td className="px-4 py-2 border">{servico.quantidade}</td>
                            <td className="px-4 py-2 border">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(servico.preco_unitario)}
                            </td>
                            <td className="px-4 py-2 border">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(servico.total_receita)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <button
                      className="mt-4 bg-red-500 text-white px-4 py-2 rounded shadow"
                      onClick={() => deleteReport(report.id)}
                    >
                      Excluir
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
