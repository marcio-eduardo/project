
import { Button } from "../ui/button"

interface SigninButtonProps {
  isSubmitting: boolean
}


export function SigninButton ({ isSubmitting }: SigninButtonProps) {
  return (
    <div className="w-full flex items-center justify-center">
      <Button
        disabled={isSubmitting}
        className={`w-20 ${isSubmitting ? 'bg-gray-300' : 'bg-blue-500'} text-white`}
        type="submit"
      >
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </Button>
    </div>
  )
}