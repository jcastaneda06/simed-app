import { FC, Ref } from 'react'

type TextFieldProps = {
  value: string
  onClick?: () => void
  onChange: (value: string) => void
  placeholder?: string
}

const TextFIeld: FC<TextFieldProps> = (props) => {
  const { value, onChange, onClick, placeholder } = props
  return (
    <input
      value={value}
      type="text"
      className="block text-base sm:text-sm w-full rounded-md border border-gray-300 text-black px-3 py-2 outline-none"
      placeholder={placeholder}
      onClick={onClick}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export default TextFIeld
