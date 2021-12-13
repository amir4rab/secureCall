import { AnimatePresence } from "framer-motion";
import Layout from "../src/components/layout/layout";

import '../styles/globals.scss';

// import { SessionProvider } from 'next-auth/react'
// import { ContactsProvider } from '../src/providers/contactsProvider/contactsProvider';
// import { SocketsProvider } from '../src/providers/socketsProvider/socketsProvider';
import NotificationOverlay from '../src/overlay/notificationOverlay';

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)

  return getLayout(
    // <SessionProvider>
    //   <ContactsProvider>
    //     <SocketsProvider>
        <Layout>
          <NotificationOverlay>
            <AnimatePresence>
              <Component {...pageProps} />
            </AnimatePresence>
          </NotificationOverlay>
        </Layout>
    //    </SocketsProvider>
    //  </ContactsProvider>
    //</SessionProvider>
  )
}

export default MyApp
