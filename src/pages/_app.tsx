import Layout from '@/layout/Layout'
import { useRouter } from 'next/router'
import '../styles/globals.css'
import { useEffect } from 'react'

import { AppProps } from 'next/app'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ConfigProvider, useConfig } from '@/config/ConfigProvider'
import { EdgeStoreProvider } from '@/lib/edgestore'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <EdgeStoreProvider>
          {router.pathname === '/login' ? (
            <Component {...pageProps} />
          ) : (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
        </EdgeStoreProvider>
      </ConfigProvider>
    </QueryClientProvider>
  )
}

export default MyApp
