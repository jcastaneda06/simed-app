import { FC } from 'react'

type IconButtonProps = {
  icon: JSX.Element
  onClick: (e?: any) => void
}

const IconButton: FC<IconButtonProps> = (props) => {
  const { icon, onClick } = props

  return (
    <button
      type="button"
      className="flex justify-center items-center rounded-full hover:bg-gray-200 transition-all ease-in-out w-8 h-8"
      onClick={onClick}
    >
      {icon}
    </button>
  )
}

export default IconButton
