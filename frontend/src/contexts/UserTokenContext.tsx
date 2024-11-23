
import { createContext, useContext } from "react";

/* ---------------- Contexto do Usuário ---------------- */
interface UserContextType {
  token: string | null;
  userType: string | null;
  updateUser: (token: string, userType: string) => void;
}

export const UserContext = createContext({} as UserContextType)

// Hook personalizado para acessar o contexto
export function useTokenUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
}