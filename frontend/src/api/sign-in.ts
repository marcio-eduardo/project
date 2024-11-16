import { api } from "@/lib/axios"

export interface SignInBody {
  email: string;
  password: string; // Adiciona o campo password
}

export async function signIn({ email, password }: SignInBody) {
  await api.post('/login', { email, password }); // Inclui password na requisição
}