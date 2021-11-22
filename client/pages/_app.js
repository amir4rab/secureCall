import '../styles/globals.scss';
import { SessionProvider } from 'next-auth/react'
import { AnimatePresence } from "framer-motion";
import { ContactsProvider } from '../src/providers/contactsProvider/contactsProvider';

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider>
      <ContactsProvider>
        <AnimatePresence exitBeforeEnter>
          <Component {...pageProps} />
        </AnimatePresence>
      </ContactsProvider>
    </SessionProvider>
  )
}

export default MyApp
