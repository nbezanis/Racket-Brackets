import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../auth/AuthProvider'
import Header from "../Components/Header";

function MyApp({ Component, pageProps }: AppProps) {
  return(
    <AuthProvider>
      <Header/>
      <Component {...pageProps} />
    </AuthProvider>
  )
}
export default MyApp
