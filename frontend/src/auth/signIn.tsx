import { useForm } from 'react-hook-form';

import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { signIn } from '@/api/sign-in';
import { useNavigate } from 'react-router-dom';

// Define o esquema de validação com critérios para senha
const signInForm = z.object({
  email: z.string().email(),
  password:z
    .string()
});

type SignInForm = z.infer<typeof signInForm>;

export function SignIn() {
  const { 
    register, 
    handleSubmit, 
    formState: { isSubmitting, errors }, 
  } = useForm<SignInForm>({
    resolver: async (values) => {
      const result = signInForm.safeParse(values);
      return {
        values: result.success ? result.data : {},
        errors: result.success
          ? {}
          : result.error.format(), // Formata os erros para serem usados com o React Hook Form
      };
    },
  });

  const {  mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  })

  const navigate = useNavigate()

  // Função que valida usuário cadastrado
  async function handleSignIn(data: SignInForm) {
    console.log(data)

    try {
      await authenticate({ email: data.email, password: data.password })
      console.log(authenticate)
      navigate("/")
    } catch {
      alert(`Não foi possível logar.`);
    }
  }

  return (
    <div className="w-[540px] h-[660px] rounded-lg flex items-center justify-center bg-gray-100 overflow-hidden">
      <div className="w-full max-w-sm p-6 rounded-lg ">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>

        <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
          
          {/*---------- Input Email ---------- */}
          <div>
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite seu email"
              required
            />
          </div>

          {/*---------- Input Senha ---------- */}
          <div>
            <label htmlFor="password" className="block text-gray-700">Senha</label>
            <input
              type="password"
              id="password"
              {...register('password')}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite sua senha"
              required
            />
            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
          </div>
         
          {/*---------- Button ---------- */}
          <div className="w-full flex items-center justify-center ">
            <Button disabled={isSubmitting} className="w-20 bg-blue-500 text-white" type="submit">
              Entrar
            </Button>
          </div>
        </form>

         
        {/* Implementar futuramente - Campo esqueceu senha
        <div className="text-center mt-4">
          <a href="#" className="text-blue-500 hover:underline text-sm">Esqueceu a senha?</a>
        </div>*/}

        {/*---------- Primeiro acesso ----------*/}
        <div className="text-center mt-4">
          <a href="/signup" className="text-blue-500 hover:underline text-sm">Primeiro acesso?</a>
        </div>
      </div>
    </div>
  );
}
