import {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
  FC,
} from 'react'
import { Usuario } from '@/types/Usuario'

interface ConfigContextType {
  apiUrl: string | undefined
  tokenState: {
    get: () => string | null
    set: (newToken: string) => void
  }
  userState: {
    user: Usuario | null
    set: (newUser: Usuario) => void
  }
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider')
  }
  return context
}

export const ConfigProvider: FC<PropsWithChildren> = (props) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const { children } = props
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<Usuario | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('usuario')

    if (storedToken) {
      setToken(storedToken)
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  return (
    <ConfigContext.Provider
      value={{
        apiUrl: API_URL,
        tokenState: {
          get: () => token,
          set: (newToken: string) => {
            localStorage.setItem('token', newToken)
            setToken(newToken)
          },
        },
        userState: {
          user,
          set: (newUser: Usuario) => setUser(newUser),
        },
      }}
    >
      {children}
    </ConfigContext.Provider>
  )
}
