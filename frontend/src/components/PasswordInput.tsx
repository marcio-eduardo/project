import { FieldValues, UseFormRegister, FieldError } from "react-hook-form";

interface InputPasswordProps {
  register: UseFormRegister<FieldValues>;
  errors: { password?: FieldError };
}

export function InputPassword({ register, errors }: InputPasswordProps) {
  return (
    <div>
      <label htmlFor="password" className="block text-gray-700">
        Senha
      </label>
      <input
        type="password"
        id="password"
        {...register('password')}
        className={`w-full mt-1 p-2 border ${
          errors?.password ? 'border-red-500' : 'border-gray-300'
        } rounded-md focus:outline-none focus:ring-2 ${
          errors?.password ? 'focus:ring-red-500' : 'focus:ring-blue-500'
        }`}
        placeholder="Digite sua senha"
        required
      />
      {errors?.password && (
        <span className="text-red-500 text-sm">{errors.password.message}</span>
      )}
    </div>
  );
};


