// import { useForm } from 'react-hook-form';

// import { z } from 'zod';
// import { Button } from '@/components/ui/button';

// import { useMutation } from '@tanstack/react-query';
// import { signIn } from '@/api/sign-in';
// import { useNavigate } from 'react-router-dom';
// import { Helmet } from 'react-helmet-async';
// import { toast } from 'sonner';

//  //Define o esquema de validação com critérios para senha
// const signInForm = z.object({
//   email: z.string().email(),
//   password:z
//     .string()
// });

// type SignInForm = z.infer<typeof signInForm>;

// export function SignIn() {
  
//   const { 
//     register, 
//     handleSubmit, 
//     formState: { isSubmitting, errors }, 
//   } = useForm<SignInForm>({
//     resolver: async (values) => {
//       const result = signInForm.safeParse(values);
//       return {
//         values: result.success ? result.data : {},
//         errors: result.success
//           ? {}
//           : result.error.format(), // Formata os erros para serem usados com o React Hook Form
//       };
//     },
//   });

//   const {  mutateAsync: authenticate } = useMutation({
//     mutationFn: signIn,
//   })

//   const navigate = useNavigate()

//   // Função que valida usuário cadastrado
//   async function handleSignIn(data: SignInForm) {
//     console.log(data)

//     try {
//       await authenticate({ email: data.email, password: data.password })
//       console.log(authenticate)
//       toast.success("Usuário autenticado com sucesso!")
//       navigate("/dashboard")
//     } catch {
//       toast.error("Usuário ou senha invalida");
//     }
//   }

//   return (
//     <>   
//       <Helmet title="Login" />
//       <div className="w-[540px] h-[660px] rounded-lg flex items-center justify-center bg-gray-100 overflow-hidden">
//         <div className="w-full max-w-sm p-6 rounded-lg ">
//           <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>

//           <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
            
//             {/*---------- Input Email ---------- */}
//             <div>
//               <label htmlFor="email" className="block text-gray-700">Email</label>
//               <input
//                 type="email"
//                 id="email"
//                 {...register('email')}
//                 className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Digite seu email"
//                 required
//               />
//             </div>

//             {/*---------- Input Senha ---------- */}
//             <div>
//               <label htmlFor="password" className="block text-gray-700">Senha</label>
//               <input
//                 type="password"
//                 id="password"
//                 {...register('password')}
//                 className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Digite sua senha"
//                 required
//               />
//               {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
//             </div>
          
//             {/*---------- Button ---------- */}
//             <div className="w-full flex items-center justify-center ">
//               <Button disabled={isSubmitting} className="w-20 bg-blue-500 text-white" type="submit">
//                 Entrar
//               </Button>
//             </div>
//           </form>

          
//           {/* Implementar futuramente - Campo esqueceu senha
//           <div className="text-center mt-4">
//             <a href="#" className="text-blue-500 hover:underline text-sm">Esqueceu a senha?</a>
//           </div>*/}

//           {/*---------- Primeiro acesso ----------*/}
//           <div className="text-center mt-4">
//             <a href="/signup" className="text-blue-500 hover:underline text-sm">Primeiro acesso?</a>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';

import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';

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

export function SignIn() {
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

  const navigate = useNavigate();

  // Função que valida usuário cadastrado
  async function handleSignIn(data: SignInForm) {
    try {
      const response = await authenticate({ email: data.email, password: data.password });

      // Verifica se o backend retornou o token e o tipo do usuário
      if (response?.token && response?.tipo) {
        // Salva o token e o tipo no localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('userType', response.tipo);

        toast.success('Usuário autenticado com sucesso!');
        navigate('/dashboard'); // Redireciona para o dashboard
      } else {
        toast.error('Erro na autenticação. Dados inválidos recebidos.');
        console.error('Erro na resposta da API:', response);
      }
    } catch {
      
      console.error('Erro na autenticação:');
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
            <div>
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className={`w-full mt-1 p-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 ${
                  errors.email ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                placeholder="Digite seu email"
                required
              />
              {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
            </div>

            {/* Input Senha */}
            <div>
              <label htmlFor="password" className="block text-gray-700">
                Senha
              </label>
              <input
                type="password"
                id="password"
                {...register('password')}
                className={`w-full mt-1 p-2 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 ${
                  errors.password ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                placeholder="Digite sua senha"
                required
              />
              {errors.password && (
                <span className="text-red-500 text-sm">{errors.password.message}</span>
              )}
            </div>

            {/* Botão */}
            <div className="w-full flex items-center justify-center">
              <Button
                disabled={isSubmitting}
                className={`w-20 ${isSubmitting ? 'bg-gray-300' : 'bg-blue-500'} text-white`}
                type="submit"
              >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </Button>
            </div>
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
