import React, { useState, useRef, useEffect } from 'react';

import userFace from "@/assets/user-face/user-face.svg"
import logo from "@/assets/logo-small.png"
import { Link } from 'react-router-dom';


// Componente Header
export const HeaderHome: React.FC = () => {
  const [isRegistrarOpen, setIsRegistrarOpen] = useState(false);
  const [isServicosOpen, setIsServicosOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Variável para armazenar o nome do usuário
  //const [userName] = useState('João Silva'); // Exemplo de nome

  // Referências para os menus com tipos explícitos
  const registrarMenuRef = useRef<HTMLDivElement>(null);
  const servicosMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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
  
  // Adiciona o evento de clique fora do menu
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

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="flex max-w-7xl mx-auto flex items-center justify-between">
        {/* Home / Dentalis */}
        <div className="flex items-center text-2xl font-semibold">
          <img src={logo} alt="" />
          <Link to="/" className=" block px-4 py-2 text-gray-800 hover:text-blue-500 rounded">
            <h1 className='text-blue-100 hover:text-blue-900'>Dentalis</h1>
          </Link>
        </div>

        {/* Menu Principal */}
        <div className="flex pr-20">
          <h2 className="text-3xl font-semibold text-blue-100 pr-20">Seja bem-vindo</h2>
        </div>

        {/*---------- Menu signin/newUser ----------*/}
        <div 
          className="relative flex items-center" 
          ref={userMenuRef}
          onMouseEnter={() => setIsUserMenuOpen(true)}
          onMouseLeave={() => setIsUserMenuOpen(false)}
        >         
          {/*---------- Foto do usuário ----------*/}
          <span className="w-12 h-12 rounded-full cursor-pointer">
            <img
              src={userFace}
              alt="Foto do usuário"
              className="w-12 h-12 rounded-full transition duration-300 hover:filter hover:brightness-75"
              onClick={() => handleMenuToggle('user')}
            />
          </span>

          {isUserMenuOpen && (
            <div className="absolute top-12 right-0 bg-white text-black rounded-md shadow-lg w-48 z-10">
              <ul className="space-y-2 p-2">
                <li><a href="/signin" className="block px-4 py-2 hover:bg-gray-100">Login</a></li>
                <li><a href="/signup" className="block px-4 py-2 hover:bg-gray-100">Criar conta</a></li>              
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


