import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";

export function useLogout() {
  const navigate = useNavigate();

  // Função para consumir o backend e realizar o logout
  async function handleLogout() {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Nenhum token encontrado. O usuário já está deslogado.");
    }

    await api.post(
      "/logout", // Atualize a URL caso necessário
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  // Hook para gerenciar a requisição de logout
  const logoutMutation = useMutation({
    mutationFn: handleLogout,
    onSuccess: () => {
      localStorage.removeItem("token"); // Remove o token do localStorage
      toast.success("Logout realizado com sucesso!");
      navigate("/"); // Redireciona para a página de login ou home
    },
    onError: (error: unknown) => {
      console.error(error);
      console.log(localStorage)
      toast.error("Erro ao realizar logout. Tente novamente.");
    },
  });

  // Retorna a função de logout e estados úteis
  return {
    logout: logoutMutation.mutate, // A função para ser usada em outros componentes
    isLoading: logoutMutation.isPending, // Estado de carregamento
    isSuccess: logoutMutation.isSuccess, // Estado de sucesso
    isError: logoutMutation.isError, // Estado de erro
  };
}
