import { FC, PropsWithChildren, ReactNode, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

type CollapsibleSectionProps = {
  title: string
  count?: number
  icon?: ReactNode
}

const CollapsibleSection: FC<PropsWithChildren<CollapsibleSectionProps>> = (
  props
) => {
  const { title, count, children, icon } = props
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <>
      <div className="bg-white md:rounded-lg md:shadow-sm md:border border-gray-100 overflow-hidden">
        <button
          className="w-full px-4 py-4 flex justify-between items-center"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-around gap-3">
            {count && (
              <div className="h-4 w-4 p-3 flex items-center justify-center bg-blue-100 rounded-full text-sm text-blue-600">
                {count}
              </div>
            )}
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          </div>
          <div className="flex justify-end items-center">
            {isExpanded ? (
              !icon ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                icon
              )
            ) : !icon ? (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            ) : (
              icon
            )}
          </div>
        </button>
        <div
          className={`border-t border-gray-100 ${!isExpanded ? 'max-h-0' : 'max-h-[1000px]'} transition-all ease-in-out duration-500 overflow-hidden`}
        >
          {children}
        </div>
      </div>
    </>
  )
}

export default CollapsibleSection
