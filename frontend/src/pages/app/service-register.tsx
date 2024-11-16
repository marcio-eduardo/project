import React, { useState } from 'react';
//import axios from 'axios'; // Biblioteca para requisições HTTP
import { api } from '@/lib/axios';

// Função para formatar número como moeda (R$)
const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

interface FormData {
  serviceType: string;
  price: string;
  materials: string;
  description: string;
}

export function ServiceRegister() {
  const [formData, setFormData] = useState<FormData>({
    serviceType: '',
    price: '',
    materials: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Função para tratar o campo de preço
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, '');
    const numericValue = parseFloat(value) / 100;
    const formattedValue = formatCurrency(numericValue);
    setFormData((prev) => ({ ...prev, price: formattedValue }));
  };

  // Função para atualizar o estado dos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Função para enviar o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações simples
    if (!formData.serviceType || !formData.price || !formData.description) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Dados formatados para envio ao backend
      const payload = {
        name: formData.serviceType,
        price: parseFloat(formData.price.replace(/[^\d,.-]/g, '')), // Remove símbolos antes de enviar
        description: formData.description,
        date: new Date().toISOString(), // Obtém a data e hora atual
        materials: formData.materials,
      };

      // Envia a requisição POST ao backend
      const response = await api.post('/services', payload);
      setSuccessMessage('Serviço cadastrado com sucesso!');
      console.log('Resposta do backend:', response.data);

      // Limpa o formulário após o envio
      setFormData({
        serviceType: '',
        price: '',
        materials: '',
        description: '',
      });
    } catch (error) {
      console.error('Erro ao cadastrar serviço:', error);
      setErrorMessage('Erro ao cadastrar o serviço. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[540px] h-[700px] rounded-lg flex items-center justify-center bg-gray-100 overflow-hidden">
      <div className="w-full max-w-sm p-1 rounded-lg ">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Cadastro de Serviço</h2>

        {successMessage && <div className="text-green-500 text-center mb-4">{successMessage}</div>}
        {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="serviceType" className="block text-gray-700">Tipo de Serviço</label>
            <input
              type="text"
              id="serviceType"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Consultoria, Manutenção"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-gray-700">Preço (R$)</label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handlePriceChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o preço"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-gray-700">Descrição</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva os detalhes do serviço"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar Serviço'}
          </button>
        </form>
      </div>
    </div>
  );
}

//export default ServiceRegistrationForm;
