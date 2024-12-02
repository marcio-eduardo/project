import { api } from '@/lib/axios';
import { useState } from 'react';

interface Employee {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  endereco: string;
  funcao: string;
  data_nascimento: string; // Data de nascimento
  data_contratacao: string; // Data de contratação
}

export function EmployeeRegister() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [funcao, setFuncao] = useState('');
  const [dataNascimento, setDataNascimento] = useState(''); // Data de nascimento
  const [dataContratacao, setDataContratacao] = useState(''); // Data de contratação

  // Função para adicionar um novo funcionário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Se a data de contratação não for informada, usa a data atual
    const dataAtual = new Date().toISOString().split('T')[0]; // Mantém apenas a data (sem hora)
    const newEmployee: Employee = {
      nome,
      cpf,
      telefone,
      email,
      endereco,
      funcao,
      data_nascimento: dataNascimento, // Data de nascimento do usuário
      data_contratacao: dataContratacao || dataAtual, // Se o campo estiver vazio, usa a data atual
    };

    try {
      const response = await api.post('/employees', newEmployee);
      console.log('Funcionário adicionado:', response.data);
      // Limpar os campos após a submissão
      setNome('');
      setCpf('');
      setTelefone('');
      setEmail('');
      setEndereco('');
      setFuncao('');
      setDataNascimento('');
      setDataContratacao('');
    } catch (error) {
      console.error('Erro ao adicionar funcionário:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center">Adicionar Novo Funcionário</h2>

      {/* Campos do formulário */}
      <div>
        <label className="block text-gray-700">Nome</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700">CPF</label>
        <input
          type="text"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700">Telefone</label>
        <input
          type="text"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700">Endereço</label>
        <input
          type="text"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700">Função</label>
        <input
          type="text"
          value={funcao}
          onChange={(e) => setFuncao(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700">Data de Nascimento</label>
        <input
          type="date"
          value={dataNascimento}
          onChange={(e) => setDataNascimento(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-gray-700">Data de Contratação</label>
        <input
          type="date"
          value={dataContratacao}
          onChange={(e) => setDataContratacao(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
      >
        Adicionar Funcionário
      </button>
    </form>
  );
}
