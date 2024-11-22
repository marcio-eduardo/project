import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

// export default tseslint.config(
//   { 
//     ignores: ['dist'] 
//   },
//   {
//     extends: [
//       js.configs.recommended, 
//       ...tseslint.configs.recommended
//     ],
//     languageOptions: {
//       ecmaVersion: 2020,
//       globals: {
//         ...globals.browser, // Certifique-se de que 'globals.browser' está correto e acessível
//       },
//     },
//     plugins: {
//       'react-hooks': reactHooks,
//       'react-refresh': reactRefresh,
//     },
//     files: ["**/*.ts", "**/*.tsx"], // Definição de padrão para os arquivos
//     rules: {
//       ...reactHooks.configs.recommended.rules,
//       'react-refresh/only-export-components': [
//         'warn',
//         { allowConstantExport: true },
//       ],
//     },
    
//   },
// );

export default tseslint.config(
  {
    ignores: ['dist'], // Ignora a pasta de saída do build
  },
  {
    extends: [
      js.configs.recommended, // Configurações recomendadas para JavaScript
      ...tseslint.configs.recommended, // Configurações recomendadas para TypeScript
    ],
    languageOptions: {
      ecmaVersion: 2020, // Define a versão do ECMAScript
      globals: {
        ...globals.browser, // Certifique-se de que 'globals.browser' está corretamente importado
      },
    },
    plugins: {
      'react-hooks': reactHooks, // Adiciona o plugin para regras de hooks do React
      'react-refresh': reactRefresh, // Adiciona o plugin para React Refresh
    },
    files: ["**/*.ts", "**/*.tsx"], // Define o padrão de arquivos a serem analisados
    rules: {
      ...reactHooks.configs.recommended.rules, // Regras recomendadas do React Hooks
      'react-refresh/only-export-components': [
        'warn', // Emite aviso para componentes que não são exportados corretamente
        { allowConstantExport: true }, // Permite a exportação de constantes
      ],
      '@typescript-eslint/no-unused-expressions': [
    'error',
    {
      allowShortCircuit: true, // Permite expressões de curto-circuito (ex: `foo && foo()`)
      allowTernary: true, // Permite expressões ternárias (ex: `foo ? bar : baz`)
      allowTaggedTemplates: true, // Permite templates taggeados
    },
  ],
    },
  }
);

