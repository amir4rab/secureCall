import { useRouter } from 'next/router';

import { SessionProvider } from 'next-auth/react'
import { ContactsProvider } from '../../providers/contactsProvider/contactsProvider';
import { SocketsProvider } from '../../providers/socketsProvider/socketsProvider';
import SocketManager from './socketManager';

function Layout({ children }) {
  const router = useRouter();

  if( router.pathname.includes('panel') ) return (
    <SessionProvider>
      <ContactsProvider>
        <SocketsProvider>
          <SocketManager>
            { children }
          </SocketManager>
        </SocketsProvider>
      </ContactsProvider>
    </SessionProvider>
  );

  return (
    <SessionProvider>
      <ContactsProvider>
        <SocketsProvider>
          { children }
        </SocketsProvider>
      </ContactsProvider>
    </SessionProvider>
  );
};

export default Layout;
