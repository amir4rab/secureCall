import { useContext, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

import Trans from 'next-translate/Trans';

import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { SocketsContext } from '../../providers/socketsProvider/socketsProvider';
import LoadingDisplay from '../loadingAnimation/loadingDisplay';
import useTranslation from 'next-translate/useTranslation';


function SocketManager({ children }) {
  const session = useSession();
  const isInit = useRef(true);
  const router = useRouter();
  const { t } = useTranslation('common')
  const {
    connect,
    isConnected
  } = useContext(SocketsContext);

  const initSocket = useCallback(async () => {
    isInit.current = false;
    const apiRes = await fetch('/api/access-token');
    const { accessToken } = await apiRes.json();
    connect({
      jwt: accessToken,
      email: session.data.user.email
    })
  }, [ connect, session ]);

  useEffect( _ => {
    if( session.status === 'unauthenticated' ) router.push('/');
    if( session.status === 'authenticated' && !isConnected && isInit.current ) {
      initSocket();
    }
  }, [ session, isConnected, initSocket, router ])

  if( isConnected === false ) {
    return (
      <LoadingDisplay text={ `${t('connecting')}...` }>
        <p style={{ marginTop: '1rem', textAlign: 'center', padding: "0 2rem", lineHeight: '150%' }}><Trans i18nKey='common:longLoading' components={[ <Link href='/status' key="link"/> ]} /></p>
      </LoadingDisplay>
    )
  }

  return (
    <>
      { children } 
    </>
  )
}

export default SocketManager
