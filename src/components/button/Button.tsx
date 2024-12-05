import { FC, ReactNode } from 'react'

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'danger'
  onClick?: () => void
  text: string
  icon: ReactNode
}

const Button: FC<ButtonProps> = (props) => {
  const { variant, onClick, text, icon } = props

  const getVariant = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 hover:bg-blue-600 text-white'
      case 'secondary':
        return 'bg-gray-500 hover:bg-gray-600'
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white'
      default:
        return 'bg-blue-500 hover:bg-blue-600 text-white'
    }
  }
  return (
    <button
      type="button"
      className={
        'flex items-center justify-center text-center gap-2 px-4 py-2 rounded-md transition-colors ' +
        getVariant()
      }
      onClick={onClick}
    >
      {icon}
      {text}
    </button>
  )
}
Button.displayName = 'Button'

export { Button }
