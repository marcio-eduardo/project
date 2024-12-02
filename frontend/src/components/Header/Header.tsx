import logo from "@/assets/logo-small.png";
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useLogout } from "@/auth/signOut"; // Importe o hook de logout

// Componente Header
export function Header() {
  const [isCadastroOpen, setIsCadastroOpen] = useState(false);
  const [isServicosOpen, setIsServicosOpen] = useState(false);
  const [isRelatoriosOpen, setIsRelatoriosOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [userName] = useState('João Silva'); // Exemplo de nome do usuário

  const cadastroMenuRef = useRef<HTMLDivElement>(null);
  const servicosMenuRef = useRef<HTMLDivElement>(null);
  const relatoriosMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const { logout } = useLogout();
  // Usando o hook de logout
  // Função para fechar os menus quando clicar fora
  const handleClickOutside = (event: MouseEvent) => {
    if (cadastroMenuRef.current && !cadastroMenuRef.current.contains(event.target as Node) &&
      servicosMenuRef.current && !servicosMenuRef.current.contains(event.target as Node) &&
      relatoriosMenuRef.current && !relatoriosMenuRef.current.contains(event.target as Node) &&
      userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
      setIsCadastroOpen(false);
      setIsServicosOpen(false);
      setIsRelatoriosOpen(false);
      setIsUserMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Função para abrir um menu e fechar os outros
  const handleMenuToggle = (menu: string) => {
    if (menu === 'cadastro') {
      setIsCadastroOpen(!isCadastroOpen);
      setIsServicosOpen(false);
      setIsRelatoriosOpen(false);
      setIsUserMenuOpen(false);
    } else if (menu === 'servicos') {
      setIsServicosOpen(!isServicosOpen);
      setIsCadastroOpen(false);
      setIsRelatoriosOpen(false);
      setIsUserMenuOpen(false);
    } else if (menu === 'relatorios') {
      setIsRelatoriosOpen(!isRelatoriosOpen);
      setIsCadastroOpen(false);
      setIsServicosOpen(false);
      setIsUserMenuOpen(false);
    } else if (menu === 'user') {
      setIsUserMenuOpen(!isUserMenuOpen);
      setIsCadastroOpen(false);
      setIsRelatoriosOpen(false);
      setIsServicosOpen(false);
    }
  };

  // Função chamada quando o usuário clica em "Sair"
  const handleLogout = async () => {
    try {
      logout(); // Chama o hook de logout
      navigate("/"); // Redireciona para a página de login
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  };

  return (
    <header className="bg-blue-600 text-white p-4">
      <nav className="flex justify-center items-center">
        <div className="flex max-w-7xl w-full mx-auto items-center justify-between">
          {/* Esquerda: Dentalis + Menus */}
          <div className="flex items-center gap-6">
            <div className="flex items-center text-2xl font-semibold">
              <img src={logo} alt="Logo" className="h-12 w-12" />
              <Link to="/homepage" className="block px-4 py-2">
                <h1 className="text-blue-100 hover:text-blue-900 text-3xl">Dentalis</h1>
              </Link>
            </div>

            {/* Menu Cadastro */}
            <div className="relative" ref={cadastroMenuRef}>
              <span
                className="cursor-pointer font-semibold text-xl text-blue-100 hover:text-blue-900"
                onMouseEnter={() => handleMenuToggle('cadastro')}
                onMouseLeave={() => handleMenuToggle('')}
              >
                Cadastro
              </span>
              {isCadastroOpen && (
                <div
                  className="absolute top-8 left-0 bg-white text-black rounded-md shadow-lg w-48 z-10"
                >
                  <ul className="space-y-2 p-2">
                    <li className="relative group">
                      <span className="block px-4 py-2 cursor-pointer hover:bg-gray-100"

                      >Colaboradores</span>
                      <div className="hidden absolute left-full top-0 bg-white text-black rounded-md shadow-lg w-48 z-10 group-hover:block">
                        <ul className="space-y-2 p-2">
                          <li><a href="/employee-register" className="block px-4 py-2 hover:bg-gray-100">Cadastrar colaborador</a></li>
                          <li><a href="/employee-list" className="block px-4 py-2 hover:bg-gray-100">Listar colaboradores</a></li>
                        </ul>
                      </div>
                    </li>
                    <li className="relative group">
                      <span className="block px-4 py-2 cursor-pointer hover:bg-gray-100"

                      >Pacientes</span>
                      <div className="hidden absolute left-full top-0 bg-white text-black rounded-md shadow-lg w-48 z-10 group-hover:block">
                        <ul className="space-y-2 p-2">
                          <li><a href="/patient-register" className="block px-4 py-2 hover:bg-gray-100">Novo Paciente</a></li>
                          <li><a href="/patient-list" className="block px-4 py-2 hover:bg-gray-100">Listar Pacientes</a></li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Serviços Menu */}
            <div className="relative" ref={servicosMenuRef}>
              <span
                className="cursor-pointer font-semibold text-xl text-blue-100 hover:text-blue-900"
                onMouseEnter={() => handleMenuToggle('servicos')}
                onMouseLeave={() => handleMenuToggle('')}
              >
                Serviços
              </span>
              {isServicosOpen && (
                <div className="absolute top-8 left-0 bg-white text-black rounded-md shadow-lg w-48 z-10">
                  <ul className="space-y-2 p-2">
                    <li><a href="/assign-service" className="block px-4 py-2 hover:bg-gray-100">Atendimento</a></li>
                    <li><a href="/service-details/serviceId" className="block px-4 py-2 hover:bg-gray-100">Atendendo</a></li>
                    <li><a href="/service-register" className="block px-4 py-2 hover:bg-gray-100">Novo Serviço</a></li>
                    <li><a href="/services" className="block px-4 py-2 hover:bg-gray-100">Lista de serviços</a></li>
                  </ul>
                </div>
              )}
            </div>

            {/* Relatórios Menu */}
            <div className="relative" ref={relatoriosMenuRef}>
              <span
                className="cursor-pointer font-semibold text-xl text-blue-100 hover:text-blue-900"
                onMouseEnter={() => handleMenuToggle('relatorios')}
                onMouseLeave={() => handleMenuToggle('')}
              >
                Relatórios
              </span>
              {isRelatoriosOpen && (
                <div className="absolute top-8 left-0 bg-white text-black rounded-md shadow-lg w-48 z-10">
                  <ul className="space-y-2 p-2">
                    <li><a href="/report-select" className="block px-4 py-2 hover:bg-gray-100">Criar Relatório</a></li>
                    <li><a href="/report" className="block px-4 py-2 hover:bg-gray-100">Lista de Relatórios</a></li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Direita: Usuário */}
          <div
            className="relative flex items-center"
            ref={userMenuRef}
            onClick={() => handleMenuToggle('user')}
            onMouseLeave={() => handleMenuToggle('')}
          >
            {/* Foto do usuário */}
            <img
              src="https://randomuser.me/api/portraits/men/4.jpg"
              alt="Foto do usuário"
              className="w-12 h-12 rounded-full cursor-pointer hover:ring-2 hover:ring-white" />
            <span className="ml-2 text-sm font-medium cursor-pointer text-blue-100 hover:text-blue-900">{userName}</span>

            {isUserMenuOpen && (
              <div className="absolute top-12 right-0 bg-white text-black rounded-md shadow-lg w-48 z-10">
                <ul className="space-y-2 p-2">
                  <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Meu Perfil</a></li>
                  <li><a className="block px-4 py-2 hover:bg-gray-100">Configurações</a></li>
                  <li><a onClick={handleLogout} href="#" className="block px-4 py-2 hover:bg-gray-100">Sair</a></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}


