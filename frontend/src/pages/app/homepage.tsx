import imagem3 from "@/assets/003.png";

export function Homepage() {
  return (    
    <main className="p-5 md:p-20 grid grid-rows-2 grid-cols-2 gap-4 max-w-screen-xl mx-auto">
      {/* Seção de Imagem */}
      <div className="flex items-center justify-center bg-gray-300 rounded-lg text-center">
        <img className="w-full h-full object-cover rounded-lg" src={imagem3} alt="Imagem de uma dentadura" />
      </div>

      {/* Seção Descrição do Projeto */}
      <div className="bg-cyan-300 p-5 rounded-lg text-lg text-gray-800">
        <p className="mb-4">
          Este é um projeto desenvolvido como parte do curso de 
          <strong>Projeto Web Back-End</strong>, 
          com foco na gestão eficiente de serviços em clínicas odontológicas. 
          O sistema permite o controle de serviços realizados, 
          gerenciamento de funcionários, acompanhamento de receitas e comissões.
        </p>
        <p>
          Nossa aplicação foi projetada para simplificar processos 
          administrativos, otimizar o desempenho da equipe e oferecer insights 
          valiosos para a tomada de decisões. Este projeto representa 
          uma aplicação prática de tecnologias web modernas voltadas para o 
          gerenciamento de negócios!
        </p>
      </div>

      {/* Seção de Tecnologias Utilizadas */}
      <div className="bg-red-200 p-5 rounded-lg col-span-2">
        <h2 className="text-2xl font-semibold mb-4">Tecnologias Utilizadas no Projeto</h2>
        <ul className="list-disc pl-5 space-y-2 text-lg text-gray-800">
          <li><strong>Python e Flask</strong>: Utilizados para construir a API Back-End, garantindo uma aplicação escalável e eficiente para gerenciar os serviços e relatórios. Flask é leve e ideal para o desenvolvimento rápido de aplicações web.</li>
          <li><strong>MongoDB</strong>: Banco de dados NoSQL escolhido para armazenar de forma flexível os dados sobre funcionários, serviços e relatórios de desempenho.</li>
          <li><strong>Docker</strong>: Empregado para containerizar a aplicação, garantindo um ambiente de desenvolvimento padronizado, fácil de configurar e de implantar em diferentes plataformas.</li>
          <li><strong>React</strong>: Framework JavaScript usado no Front-End para criar uma interface interativa e responsiva, proporcionando uma experiência de usuário fluida.</li>
          <li><strong>Axios</strong>: Biblioteca utilizada para realizar requisições HTTP entre o Front-End e o Back-End, facilitando a comunicação entre as partes do sistema.</li>
          <li><strong>Tailwind CSS</strong>: Framework CSS moderno e utilitário que possibilita a criação de um design elegante e personalizável de forma rápida e eficiente.</li>
        </ul>
        <p className="mt-4">
          Essas tecnologias foram integradas para criar um sistema robusto, 
          eficiente e amigável tanto para os usuários quanto para os 
          desenvolvedores!
        </p>
      </div>
    </main>
  );
}
