import { FC, PropsWithChildren, useEffect, useRef } from 'react'

type ClickAwayListenerProps = {
  onClickAway: () => void
}

const ClickAwayListener: FC<PropsWithChildren<ClickAwayListenerProps>> = (
  props
) => {
  const ref = useRef<HTMLDivElement>(null)
  const { onClickAway, children } = props

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Verifica si el click fue fuera del contenedor
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickAway()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return <div ref={ref}>{children}</div>
}

export default ClickAwayListener
