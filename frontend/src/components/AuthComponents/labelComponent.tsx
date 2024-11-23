import { UseFormRegister, type FieldErrors } from 'react-hook-form';

interface LableComponentProps {
  register: UseFormRegister<any>;
  errors: FieldErrors
}

export function LableComponent({ register, errors }: LableComponentProps) {
  return (
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
      {errors.email && <span className="text-red-500 text-sm">{errors.email.message?.toString()}</span>}
    </div>
  )
}