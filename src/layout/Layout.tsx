import React, { FC, PropsWithChildren, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { LogOut, Menu, User } from 'lucide-react'
import { useConfig } from '@/config/ConfigProvider'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Tooltip } from 'react-tooltip'
import { toast, ToastContainer } from 'react-toastify'

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
    <div className="min-h-screen bg-muted/30">
      {/* Barra de navegación */}
      <nav className="flex flex-col bg-background shadow-md print:none">
        <div className="flex justify-between items-center 2xl:mx-72 xl:mx-16 lg:mx-4 md:mx-8 px-8 py-2 md:py-0">
          <div className="flex">
            {/* Logo o título */}
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-foreground">SIMED</h1>
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
                      ? 'border-primary text-foreground'
                      : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5 text-muted-foreground" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  {user && (
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div className="flex flex-col items-start">
                        <SheetTitle className="text-sm font-medium">
                          {user.nombre || user.email}
                        </SheetTitle>
                        <span className="text-muted-foreground text-xs">
                          {decoded?.role || 'Usuario'}
                        </span>
                      </div>
                    </div>
                  )}
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`text-sm font-medium p-2 rounded-md ${
                        router.pathname === link.href
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Button
                    variant="secondary"
                    className="w-full mt-4"
                    onClick={() => handleLogout()}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="hidden md:block gap">
            {user && (
              <div className="flex justify-between gap-4">
                <div className="rounded-lg text-sm flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div className="flex flex-col items-start">
                    <div className="flex">
                      <span className="font-medium text-foreground">
                        {user.nombre || user.email}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {decoded?.role || 'Usuario'}
                    </span>
                  </div>
                </div>
                <div
                  data-tooltip-id="logout"
                  data-tooltip-content="Cerrar sesión"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleLogout()}
                  >
                    <LogOut className="h-5 w-5 text-muted-foreground" />
                  </Button>
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
                  ? 'border-b-2 border-primary text-foreground'
                  : 'border-l-4 border-transparent text-muted-foreground hover:bg-muted hover:border-border hover:text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-0 md:px-4 lg:px-8 py-4">
        <ToastContainer
          position="top-center"
          autoClose={5000}
          style={{
            marginTop: '1rem',
          }}
        />
        {children}
      </main>
    </div>
  )
}

export default Layout
