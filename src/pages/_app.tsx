import Layout from "@/layout/Layout";
import { useRouter } from "next/router";
import "../styles/globals.css";

import { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // No usar Layout en la página de login
  if (router.pathname === "/login") {
    return <Component {...pageProps} />;
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
