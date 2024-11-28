import Layout from '@/layout/Layout'
import { useRouter } from 'next/router'
import '../styles/globals.css'
import { useEffect } from 'react'

import { AppProps } from 'next/app'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import ConfigProvider from '@/config/ConfigProvider'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  const { tokenState } = ConfigProvider()
  const token = tokenState.get()
  const router = useRouter()

  useEffect(() => {
    if (!token) router.push('/login')
  }, [token])

  return (
    <QueryClientProvider client={queryClient}>
      {router.pathname === '/login' ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </QueryClientProvider>
  )
}

export default MyApp
