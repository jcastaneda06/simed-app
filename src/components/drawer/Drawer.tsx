import { FC, PropsWithChildren } from 'react'

type DrawerProps = {
  open: boolean
}

const Drawer: FC<PropsWithChildren<DrawerProps>> = (props) => {
  const { open } = props
  return (
    <div className="fixed bg-black bg-opacity-20">
      <div
        className={`fixed top-0 text-black right-0 z-50 w-64 h-full p-4 bg-white shadow-lg transition-all ease-in-out ${!open ? 'translate-x-full' : ''}`}
      >
        {props.children}
      </div>
    </div>
  )
}

Drawer.displayName = 'Drawer'

export default Drawer
