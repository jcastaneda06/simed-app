import { Usuario } from '@/types/Usuario'
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from 'react'

interface ConfigContextType {
  token: string | null
  user: Usuario | null
  setToken: (newToken: string | null) => void
  setUser: (newUser: Usuario | null) => void
  apiUrl: string | undefined
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

export const useConfig = () => {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider')
  }
  return context
}

export const ConfigProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<Usuario | null>(null)
  const [apiUrl] = useState(process.env.NEXT_PUBLIC_API_URL)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  return (
    <ConfigContext.Provider value={{ token, user, setToken, setUser, apiUrl }}>
      {children}
    </ConfigContext.Provider>
  )
}
