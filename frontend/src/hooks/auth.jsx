import { createContext, useContext } from "react";

import { api } from '@/api'
import { toast } from "sonner";

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  async function signIn({ email, passoword }){

    try {
      const response = await api.post("/login", { email, passoword});
      console.log(response);

    } catch (error) {
      if(error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Não foi possível acessar!")
      }
    }
  }
  return (
    <AuthContext.Provider value={{ signIn }}>
      { children }
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth }
