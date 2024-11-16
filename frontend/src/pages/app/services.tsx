import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
}

export function ServicesList() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Função para buscar serviços
    const fetchServices = async () => {
      try {
        const response = await api.get("/services"); // URL do endpoint
        console.log("Dados da API:", response.data); // Verifique o formato dos dados retornados

        // Confirmação e manipulação de resposta
        if (Array.isArray(response.data)) {
          setServices(response.data); // Caso a API retorne diretamente um array
        } else if (response.data.services && Array.isArray(response.data.services)) {
          setServices(response.data.services); // Caso os serviços estejam aninhados em 'services'
        } else {
          throw new Error("Formato inesperado da resposta da API.");
        }

        setError(null); // Limpa erros
      } catch (err) {
        console.error("Erro ao buscar serviços:", err);
        setError("Não foi possível carregar os serviços.");
      } finally {
        setLoading(false); // Desativa o indicador de carregamento
      }
    };

    fetchServices();
  }, []);

  if (loading) return <div className="text-center mt-10">Carregando...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="max-w-screen-lg mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Lista de Serviços
      </h1>
      {services.length === 0 ? (
        <p className="text-center text-gray-600">
          Nenhum serviço disponível no momento.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service._id}
              className="p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {service.name}
              </h2>
              <p className="text-gray-600 mt-2">{service.description}</p>
              <p className="text-blue-600 font-bold mt-4">
                R$ {service.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
