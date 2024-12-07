import { FC, HTMLAttributes, ReactNode } from 'react'

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'danger'
  onClick?: (e?: any) => void
  text: string
  icon?: ReactNode
  style?: string
}

const Button: FC<ButtonProps> = (props) => {
  const { variant, onClick, text, icon, style } = props

  const getVariant = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 hover:bg-blue-600 text-white'
      case 'secondary':
        return 'bg-gray-200 hover:bg-gray-300'
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
        getVariant() +
        ` ${style}`
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
