import React, { FC, PropsWithChildren, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { LogOut, Menu, User, X } from 'lucide-react'
import { useConfig } from '@/config/ConfigProvider'
import Drawer from '@/components/drawer/Drawer'
import { Button } from '@/components/button/Button'
import IconButton from '@/components/icon-button/IconButton'
import { Tooltip } from 'react-tooltip'
import ClickAwayListener from '@/components/click-away-listener/ClickAwayListener'

const jwt = require('jsonwebtoken')

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter()
  const { user, token } = useConfig()
  const [open, setOpen] = useState(false)

  const decoded = jwt.decode(token)

  const navigationLinks = [
    { href: '/', label: 'Ver Interconsultas' },
    { href: '/crear-interconsulta', label: 'Crear Interconsulta' },
  ]

  const handleLogout = () => {
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('usuario')
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Barra de navegación */}
      <nav className="flex flex-col bg-white shadow-md print:none">
        <div className="flex justify-between items-center 2xl:mx-72 xl:mx-16 lg:mx-4 md:mx-8 px-8 py-2 md:py-0">
          <div className="flex ">
            {/* Logo o título */}
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-800">SIMED</h1>
            </div>
            {/* Enlaces de navegación desktop */}
            <div className="hidden md:ml-6 md:flex justify-center">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center p-4 border-b-2 text-sm font-medium
                      ${
                        router.pathname === link.href
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="md:hidden">
            <IconButton
              icon={<Menu className="h-5 w-5 text-gray-500" />}
              onClick={() => setOpen(true)}
            />
            <ClickAwayListener onClickAway={() => setOpen(false)}>
              <Drawer open={open}>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    {user && (
                      <div className="flex justify-between">
                        <div className="rounded-lg text-sm flex items-center gap-2">
                          <User className="h-5 w-5 text-gray-500" />
                          <div className="flex flex-col items-start">
                            <div className="flex">
                              <span className="font-medium text-gray-700">
                                {user.nombre || user.email}
                              </span>
                            </div>
                            <span className="text-gray-500 text-xs">
                              {decoded?.role || 'Usuario'}
                            </span>
                          </div>
                        </div>
                        <IconButton
                          icon={<X className="h-5 w-5 text-gray-500" />}
                          onClick={() => setOpen(false)}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex">
                    <Button
                      text="Cerrar sesión"
                      variant="secondary"
                      style="flex-1"
                      onClick={() => handleLogout()}
                    />
                  </div>
                </div>
              </Drawer>
            </ClickAwayListener>
          </div>
          <div className="hidden md:block gap">
            {user && (
              <div className="flex justify-between gap-4">
                <div className="rounded-lg text-sm flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <div className="flex flex-col items-start">
                    <div className="flex">
                      <span className="font-medium text-gray-700">
                        {user.nombre || user.email}
                      </span>
                    </div>
                    <span className="text-gray-500 text-xs">
                      {decoded?.role || 'Usuario'}
                    </span>
                  </div>
                </div>
                <div
                  data-tooltip-id="logout"
                  data-tooltip-content="Cerrar sesión"
                >
                  <IconButton
                    icon={<LogOut className="h-5 w-5 text-gray-500" />}
                    onClick={() => handleLogout()}
                  />
                </div>
                <Tooltip id="logout" place={'bottom'} />
              </div>
            )}
          </div>
        </div>

        {/* Menú móvil */}
        <div className="flex gap-4 justify-between sm:flex md:hidden">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex-1 p-2 text-base font-medium text-center ${
                router.pathname === link.href
                  ? 'border-b-2 border-blue-500 text-gray-900'
                  : 'border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-0 md:px-4 lg:px-8 py-4">
        {children}
      </main>
    </div>
  )
}

export default Layout
