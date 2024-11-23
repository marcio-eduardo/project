
import { UserContext, UserProvider } from "@/auth/signInPage";
import React, { useContext, useState } from "react";

// Definindo a interface Service
interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
}

export function Dashboard() {
  const { token, userType } = useContext(UserContext)
  
  // Estado para armazenar os serviços
  const [services, setServices] = useState<Service[]>([]);

  // Estado para o formulário
  const [form, setForm] = useState<Omit<Service, "_id">>({
    name: "",
    description: "",
    price: 0,
  });

  // Função para lidar com mudanças no formulário
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Cria um novo serviço com ID único
    const newService: Service = {
      _id: String(Date.now()),
      ...form,
    };

    setServices((prev) => [...prev, newService]);

    // Limpa o formulário
    setForm({
      name: "",
      description: "",
      price: 0,
    });
  };
  
  console.log(token)

  return (
    <UserProvider>
      <div className="max-w-screen-lg mx-auto p-6">
        <h1 className="
          text-3xl 
          font-bold 
          text-blue-100 
          text-center 
          mb-8"
          >Gerenciamento de Serviços | Usuário: { userType }</h1>

        {/* Formulário para adicionar serviços */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Adicionar Serviço</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Preço */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Preço (R$)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="mt-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Botão de enviar */}
          <button
            type="submit"
            className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            Adicionar Serviço
          </button>
        </form>

        {/* Lista de serviços */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Lista de Serviços</h2>

          {services.length === 0 ? (
            <p className="text-gray-600">Nenhum serviço cadastrado.</p>
          ) : (
            <ul className="space-y-4">
              {services.map((service) => (
                <li
                  key={service._id}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm"
                >
                  <h3 className="text-lg font-bold text-gray-800">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mt-1">{service.description}</p>
                  <p className="text-blue-600 font-bold mt-2">
                    R$ {service.price.toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </UserProvider>
  );
};
