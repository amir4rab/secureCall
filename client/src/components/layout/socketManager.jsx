import { useContext, useEffect } from 'react';

import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { SocketsContext } from '../../providers/socketsProvider/socketsProvider';


function SocketManager({ children }) {
  const session = useSession();
  const router = useRouter();
  const {
    connect,
    isConnected
  } = useContext(SocketsContext);

  const initSocket = async () => {
    const apiRes = await fetch('/api/access-token');
    const { accessToken } = await apiRes.json();
    console.log(session);
    connect({
      jwt: accessToken,
      email: session.data.user.email
    })
  }

  useEffect( _ => {
    if( session.status === 'unauthenticated' ) router.push('/');
    if( session.status === 'authenticated' && !isConnected ) {
      initSocket();
      // connect(session.data.user)
    }
  }, [ session, isConnected ])

  return (
    <>
      { children } 
    </>
  )
}

export default SocketManager
