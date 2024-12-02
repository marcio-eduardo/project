import { useTokenUser } from '@/auth/signInPage';
import { useNavigate } from 'react-router-dom';


interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { token, userType } = useTokenUser(); // Obtém token e userType do contexto
  const navigate = useNavigate();
  // Verifica se o token e o tipo de usuário estão presentes
  if (!token || !userType) {
    // Se não estiverem autenticados, redireciona para a página de login
    navigate('/not-logged');
    
    return null;
  }

  // Caso esteja autenticado, renderiza os filhos (conteúdo da rota protegida)
  return <>{children}</>;
}