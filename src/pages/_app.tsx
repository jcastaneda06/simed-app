import Layout from '@/layout/Layout'
import { useRouter } from 'next/router'
import '../styles/globals.css'
import { useEffect } from 'react'

import { AppProps } from 'next/app'

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

  // No usar Layout en la página de login
  if (router.pathname === '/login') {
    return <Component {...pageProps} />
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
