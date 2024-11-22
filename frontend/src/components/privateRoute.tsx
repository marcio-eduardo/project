// import React from 'react';
// import { Route, Redirect } from 'react-router-dom';

// const PrivateRoute = ({ component: Component, ...rest }: any) => {
//   const token = localStorage.getItem('token');  // Verifica o token no localStorage

//   return (
//     <Route
//       {...rest}
//       render={props =>
//         token ? (  // Se o token existir, renderiza a rota
//           <Component {...props} />
//         ) : (  // Se não, redireciona para a página de login
//           <Redirect to="/login" />
//         )
//       }
//     />
//   );
// };

// export default PrivateRoute;