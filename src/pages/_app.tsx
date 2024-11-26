import Layout from '@/layout/Layout'
import { useRouter } from 'next/router'
import '../styles/globals.css'
import { useEffect } from 'react'

import { AppProps } from 'next/app'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    const token = window.localStorage.getItem('token')

    if (
      typeof window !== 'undefined' &&
      !token &&
      router.pathname !== '/login'
    ) {
      router.push('/login')
    }
  }, [router])

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
