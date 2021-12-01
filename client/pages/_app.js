import '../styles/globals.scss';
import { SessionProvider } from 'next-auth/react'
import { AnimatePresence } from "framer-motion";
import { ContactsProvider } from '../src/providers/contactsProvider/contactsProvider';
import { SocketsProvider } from '../src/providers/socketsProvider/socketsProvider';

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider>
      <ContactsProvider>
        <SocketsProvider>
          <AnimatePresence exitBeforeEnter>
            <Component {...pageProps} />
          </AnimatePresence>
        </SocketsProvider>
      </ContactsProvider>
    </SessionProvider>
  )
}

export default MyApp
