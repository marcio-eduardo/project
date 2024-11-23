import React, { useState, useRef, useEffect } from 'react';
import logo from "@/assets/logo-small.png";
import { Link, useNavigate } from 'react-router-dom';

import { useLogout } from "@/auth/signOut"; // Importe o hook de logout

// Componente Header
const Header: React.FC = () => {
  const [isRegistrarOpen, setIsRegistrarOpen] = useState(false);
  const [isServicosOpen, setIsServicosOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [userName] = useState('João Silva'); // Exemplo de nome do usuário

  const registrarMenuRef = useRef<HTMLDivElement>(null);
  const servicosMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  
  const { logout } = useLogout();
   // Usando o hook de logout

  // Função para fechar os menus quando clicar fora
  const handleClickOutside = (event: MouseEvent) => {
    if (
      registrarMenuRef.current && !registrarMenuRef.current.contains(event.target as Node) &&
      servicosMenuRef.current && !servicosMenuRef.current.contains(event.target as Node) &&
      userMenuRef.current && !userMenuRef.current.contains(event.target as Node)
    ) {
      setIsRegistrarOpen(false);
      setIsServicosOpen(false);
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
    if (menu === 'registrar') {
      setIsRegistrarOpen(!isRegistrarOpen);
      setIsServicosOpen(false);
      setIsUserMenuOpen(false);
    } else if (menu === 'servicos') {
      setIsServicosOpen(!isServicosOpen);
      setIsRegistrarOpen(false);
      setIsUserMenuOpen(false);
    } else if (menu === 'user') {
      setIsUserMenuOpen(!isUserMenuOpen);
      setIsRegistrarOpen(false);
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

            {/* Registrar Menu */}
            <div className="relative" ref={registrarMenuRef}>
              <span
                className="cursor-pointer font-semibold text-xl text-blue-100 hover:text-blue-900"
                onMouseEnter={() => handleMenuToggle('registrar')}
                onMouseLeave={() => handleMenuToggle('')}
              >
                Registrar
              </span>
              {isRegistrarOpen && (
                <div className="absolute top-8 left-0 bg-white text-black rounded-md shadow-lg w-48 z-10">
                  <ul className="space-y-2 p-2">
                    <li><a href="/employee-register" className="block px-4 py-2 hover:bg-gray-100">Novo Colaborador</a></li>
                    <li><a href="/patient-register" className="block px-4 py-2 hover:bg-gray-100">Novo Paciente</a></li>
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
                    <li><a href="/service-register" className="block px-4 py-2 hover:bg-gray-100">Novo Serviço</a></li>
                    <li><a href="/services" className="block px-4 py-2 hover:bg-gray-100">Lista de serviços</a></li>
                    <li><a href="/patient-table" className="block px-4 py-2 hover:bg-gray-100">Lista de Pacientes</a></li>
                    <li><a href="/service-register" className="block px-4 py-2 hover:bg-gray-100">Editar serviços</a></li>
                  </ul>
                </div>
              )}
            </div>

            {/* Relatórios */}
            <span className="cursor-pointer font-semibold text-xl text-blue-100 hover:text-blue-900">Relatórios</span>
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
              className="w-12 h-12 rounded-full cursor-pointer hover:ring-2 hover:ring-white"
            />
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
};

export default Header;
