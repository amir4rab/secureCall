import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import Head from 'next/head';

import IncognitoCallManager from '../../src/components/incognitoManager/incognitoCallManager';

import { validateQuery } from '../../src/utils/frontend/validators/validators';
import { getQueries } from '../../src/utils/frontend/getQueries/getQueries';
import LoadingDisplay from '../../src/components/loadingAnimation/loadingDisplay';

const getDetails = ( path ) => {
  const query = getQueries(path)

  if ( !validateQuery({ query, maxLength: 2, items: ['id','secret']}) ) {
    return false;
  }

  return query
};

function IncognitoCallPage() {
  const [ callDetails, setCallDetails ] = useState({ otherPeerId: null, otherPeerSecret: null, calling: null  });
  const [ isReady, setIsReady ] = useState(false);
  const router = useRouter();


  const init = useCallback(() => {
    if( router.query?.calling === 'false' ) {
      setCallDetails({ otherPeerId: null, otherPeerSecret: null, calling: false  });
    } else {
      const hiddenQueries = getDetails(router.asPath);
      if ( !hiddenQueries ) router.push('/incognito');

      setCallDetails({ otherPeerId: hiddenQueries.id, otherPeerSecret: hiddenQueries.secret, calling: true  })
    }
    setIsReady(true);
  }, [ router ])

  useEffect( _ => {
    if ( typeof router.query?.calling !== 'undefined' && !isReady ) init();
  }, [ init, router, isReady ]);

  return (
    <>
      <Head>
        <title>Secure call</title>
      </Head>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <AnimatePresence>
          {
            !isReady ?
            <LoadingDisplay /> :
            <IncognitoCallManager 
              otherPeerId={ callDetails.otherPeerId } 
              otherPeerSecret={ callDetails.otherPeerSecret } 
              isInitializer={ callDetails.calling } 
            />
          }
        </AnimatePresence>
      </motion.div>
    </>
  )
}

export default IncognitoCallPage
