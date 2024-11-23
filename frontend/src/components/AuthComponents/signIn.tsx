
export function SignIn() {
  return (
    // Função que valida usuário cadastrado
async function handleSignIn(data: SignInForm) {
  try {
    const response = await authenticate({ email: data.email, password: data.password });

    // Verifica se o backend retornou o token e o tipo do usuário
    if (response?.token && response?.tipo) {
      updateUser(response.token, response.tipo); // Atualiza o contexto

      toast.success('Usuário autenticado com sucesso!');
      navigate('/dashboard'); // Redireciona para o dashboard
    } else {
      toast.error('Erro na autenticação. Dados inválidos recebidos.');
      console.error('Erro na resposta da API:', response);
    }
  } catch (error) {
    console.error('Erro na autenticação:', error);
    toast.error('Erro ao autenticar. Verifique suas credenciais.');
  }
}
  )
}
