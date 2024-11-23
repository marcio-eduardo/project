
export function NotLoggedInPage() {
  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Você não está logado!!!</h1>
        <p className="text-gray-700">
          Por favor, faça login para acessar esta página.
        </p>
      </div>
    </div>
  );
}


