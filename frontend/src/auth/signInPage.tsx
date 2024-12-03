import { PasswordInput } from '@/components/AuthComponents/inputPassword';
import { LableComponent } from '@/components/AuthComponents/labelComponent';
import { SigninButton } from '@/components/AuthComponents/signInButton';
import { api } from '@/lib/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

/* ---------------- Contexto do Usuário ---------------- */
interface UserContextType {
  token: string | null;
  userType: string | null;
  updateUser: (token: string, userType: string) => void;
}

export const UserContext = createContext({} as UserContextType)

interface UserContextProviderProps {
  children: ReactNode
}
export function UserProvider({ children }: UserContextProviderProps) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userType, setUserType] = useState<string | null>(localStorage.getItem('userType'));

  const updateUser = (newToken: string, newUserType: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userType', newUserType);
    setToken(newToken);
    setUserType(newUserType);
  };

  return (
    <UserContext.Provider value={{ token, userType, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

/* ---------------- Formulário de Login ---------------- */

// Define o esquema de validação com critérios para senha
const signInForm = z.object({
  email: z.string().email({ message: 'Digite um email válido.' }),
  password: z.string(),
});

type SignInForm = z.infer<typeof signInForm>;

// Função para chamar a API de login
const signIn = async (data: SignInForm) => {
  const response = await api.post('/login', data); // Ajuste a URL para o seu endpoint real
  return response.data; // Espera-se que o backend retorne { token, tipo }
};

// Hook personalizado para acessar o contexto
export function useTokenUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
}

export function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInForm),
  });

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  });

  const { updateUser } = useTokenUser();
  const navigate = useNavigate();

  // Função que valida usuário cadastrado
  async function handleSignIn(data: SignInForm) {
    try {
      const response = await authenticate({ email: data.email, password: data.password });

      // Verifica se o backend retornou o token e o tipo do usuário
      if (response?.token && response?.tipo) {
        updateUser(response.token, response.tipo); // Atualiza o contexto

        toast.success('Usuário autenticado com sucesso!');
        navigate('/service-register'); // Redireciona para o dashboard
      } else {
        toast.error('Erro na autenticação. Dados inválidos recebidos.');
        console.error('Erro na resposta da API:', response);
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      toast.error('Erro ao autenticar. Verifique suas credenciais.');
    }
  }

  return (
    <>
      <Helmet title="Login" />
      <div className="w-[540px] h-[660px] rounded-lg flex items-center justify-center bg-gray-100 overflow-hidden">
        <div className="w-full max-w-sm p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>

          <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
            {/* Input Email */}
           <LableComponent register={register} errors={errors} />

            {/* Input Senha */}
            <PasswordInput register={register} error={errors.password} />

            {/* Botão */}
            <SigninButton isSubmitting={isSubmitting}/>
          </form>

          {/* Link Primeiro Acesso */}
          <div className="text-center mt-4">
            <a href="/signup" className="text-blue-500 hover:underline text-sm">
              Primeiro acesso?
            </a>
          </div>
        </div>
      </div>
    </>
  );
}