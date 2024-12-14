import { ChangeEventHandler, FC, ReactNode } from 'react'

type SelectProps = {
  value: string
  placeholder?: string
  children: ReactNode
  onChange: ChangeEventHandler<HTMLSelectElement>
}

type SelectItemProps = {
  value: string
  selected?: boolean
  children: ReactNode
}

const SelectItem: FC<SelectItemProps> = (props) => {
  const { value, children, selected } = props
  return (
    <option
      value={value}
      selected={selected}
      className="text-gray-900 hover:bg-gray-100 bg-white pr="
    >
      {children}
    </option>
  )
}

const Select: FC<SelectProps> = (props) => {
  const { children, value, onChange } = props
  return (
    <select
      className="block px-4 py-2 mt-2 text-base text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      onChange={onChange}
      value={value}
    >
      {children}
    </select>
  )
}

Select.displayName = 'Select'
SelectItem.displayName = 'SelectItem'

export { Select, SelectItem }
