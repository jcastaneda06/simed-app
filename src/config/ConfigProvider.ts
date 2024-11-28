import { useEffect, useState } from 'react'

const ConfigProvider = () => {
  const [token, setToken] = useState<string | null>(null)
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      setToken(token)
    }
  }, [])
  return {
    apiUrl: API_URL,
    tokenState: {
      get: () => token,
      set: (newToken: string) => setToken(newToken),
    },
  }
}

export default ConfigProvider
