// import { createContext, useContext } from "react";

// import { api } from "@/lib/axios";

// const AuthContext = createContext({});

// function AuthProvider({ children }) {

//   async function signIn( email, password ) {
//     try {
//       const response = await api.post("/users", { email, password })
//       console.log(response)

//     } catch (error) {
//       if(error.response) {
//         alert(error.response.data.mesage)
//       } else {
//         alert("Não foi possivel entrar!")
//       }
//     }
//   }

//   return (
//     <AuthContext.Provider value={{ signIn }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// function useAuth() {
//   const context = useContext(AuthContext);

//   return context;
// }

// export { AuthProvider, useAuth }