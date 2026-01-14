import { FC, PropsWithChildren, ReactNode, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/cn'

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
      <div className="bg-background md:rounded-lg md:shadow-sm md:border border-border overflow-hidden">
        <button
          className="w-full px-4 py-4 flex justify-between items-center"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-around gap-3">
            {count !== undefined && (
              <div className="h-4 w-4 p-3 flex items-center justify-center bg-primary/10 rounded-full text-sm text-primary">
                {count}
              </div>
            )}
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          </div>
          <div className="flex justify-end items-center">
            {isExpanded ? (
              !icon ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                icon
              )
            ) : !icon ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            ) : (
              icon
            )}
          </div>
        </button>
        <div
          className={cn(
            'border-t border-border transition-all ease-in-out duration-500 overflow-hidden',
            !isExpanded ? 'max-h-0' : 'max-h-[1000px]'
          )}
        >
          {children}
        </div>
      </div>
    </>
  )
}

export default CollapsibleSection
