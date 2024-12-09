import { FC } from 'react'

type IconButtonProps = {
  icon: JSX.Element
  onClick: (e?: any) => void
  variant?: 'primary' | 'secondary' | 'danger'
}

const IconButton: FC<IconButtonProps> = (props) => {
  const { icon, onClick, variant } = props

  const getVariant = () => {
    switch (variant) {
      case 'primary':
        return 'hover:bg-blue-100 text-blue-500'
      case 'secondary':
        return 'hover:bg-gray-100 text-gray-500'
      case 'danger':
        return 'hover:bg-red-100 text-red-500'
      default:
        return 'hover:bg-blue-100 text-blue-500'
    }
  }

  return (
    <button
      type="button"
      className={
        'flex justify-center items-center rounded-full transition-all ease-in-out w-8 h-8 ' +
        getVariant()
      }
      onClick={onClick}
    >
      {icon}
    </button>
  )
}

export default IconButton
