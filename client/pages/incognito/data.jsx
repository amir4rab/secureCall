import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import Head from 'next/head';

import IncognitoDataChannelManager from '../../src/components/incognitoManager/incognitoDataChannelManager';

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

function IncognitoDataPage() {
  const [ callDetails, setCallDetails ] = useState({ otherPeerId: null, otherPeerSecret: null, initializer: null  });
  const [ isReady, setIsReady ] = useState(false);
  const router = useRouter();


  const init = useCallback(() => {
    if( router.query?.initializer === 'false' ) {
      setCallDetails({ otherPeerId: null, otherPeerSecret: null, initializer: false  });
    } else {
      const hiddenQueries = getDetails(router.asPath);
      if ( !hiddenQueries ) router.push('/incognito');
      console.log(hiddenQueries);

      setCallDetails({ otherPeerId: hiddenQueries.id, otherPeerSecret: hiddenQueries.secret, initializer: true  })
    }
    setIsReady(true);
  }, [ router ])

  useEffect( _ => {
    if ( typeof router.query?.initializer !== 'undefined' && !isReady ) init();
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
            <IncognitoDataChannelManager 
              otherPeerId={ callDetails.otherPeerId } 
              otherPeerSecret={ callDetails.otherPeerSecret } 
              isInitializer={ callDetails.initializer } 
            />
          }
        </AnimatePresence>
      </motion.div>
    </>
  )
}

export default IncognitoDataPage
