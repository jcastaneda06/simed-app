import Layout from '@/layout/Layout'
import { useRouter } from 'next/router'
import '../styles/globals.css'
import { useEffect } from 'react'

import { AppProps } from 'next/app'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ConfigProvider, useConfig } from '@/config/ConfigProvider'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        {router.pathname === '/login' ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </ConfigProvider>
    </QueryClientProvider>
  )
}

export default MyApp
