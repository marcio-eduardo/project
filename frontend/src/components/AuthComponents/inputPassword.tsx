
import { FieldError, UseFormRegister } from 'react-hook-form';



interface PasswordInputProps {
  register: UseFormRegister<any>;
  error?: FieldError;
}

export function PasswordInput({ register, error }: PasswordInputProps) {
  return (
    <div>
      <label htmlFor="password" className="block text-gray-700">
        Senha
      </label>
      <input
        type="password"
        id="password"
        {...register('password')}
        className={`w-full mt-1 p-2 border ${error ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'
          }`}
        placeholder="Digite sua senha"
        required
      />
      {error && <span className="text-red-500 text-sm">{error.message}</span>}
    </div>
  );
}
