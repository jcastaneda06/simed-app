import { FC, PropsWithChildren, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

type CollapsibleSectionProps = {
  title: string
  count: number
}

const CollapsibleSection: FC<PropsWithChildren<CollapsibleSectionProps>> = ({
  title,
  count,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <button
        className="w-full px-4 py-3 flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <span className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
            {count}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>
      {isExpanded && (
        <div className="p-4 border-t border-gray-100">{children}</div>
      )}
    </div>
  )
}

export default CollapsibleSection
