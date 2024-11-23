import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default {
  ignores: ['dist'], // Ignora a pasta de saída do build
  extends: [
    js.configs.recommended, // Configurações recomendadas para JavaScript
    'eslint:recommended', // Configurações recomendadas do ESLint
    'plugin:prettier/recommended', // Adiciona Prettier
    'plugin:@typescript-eslint/recommended', // Regras recomendadas para TypeScript
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
  files: ['**/*.ts', '**/*.tsx'], // Define o padrão de arquivos a serem analisados
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
    'max-len': ['error', { code: 80 }], // Limita a 80 caracteres por linha
    'prettier/prettier': [
      'error',
      {
        printWidth: 80, // Máximo de caracteres por linha
        tabWidth: 6, // Largura da indentação
        useTabs: false, // Usa espaços em vez de tabs
        singleQuote: true, // Aspas simples
        trailingComma: 'all', // Vírgula final em objetos e arrays
      },
    ],
    'linebreak-style': ['error', 'unix'], // Usa '\n' (Unix) para melhor portabilidade
  },
};
