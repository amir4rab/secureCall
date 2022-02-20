import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';

import useWebRtc from '../../utils/hooks/useWebrtc';

import useTranslation from 'next-translate/useTranslation';
import IncognitoWaitingDisplay from './incognitoWaitingDisplay/incognitoWaitingDisplay';
import FileManager from '../fileTransfer/fileManager/fileManager';


const MotionWrapper = ({ children }) => {
  return (<motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}>{children}</motion.div>)
}

function IncognitoCallManager({ otherPeerId, otherPeerSecret, isInitializer }) {
  const { t } = useTranslation('callDisplay');
  const router = useRouter();

  const [ selfPeerDetails, setSelfPeerDetails ] = useState(null);
  const [ remotePeerDetails, setRemotePeerDetails ] = useState(null);
  const [ currentMessage, setCurrentMessage ] = useState(null);

  const [ connectionIsEstablished, setConnectionIsEstablished ] = useState(false);

  const [ isInitialized, setIsInitialized ] = useState(false);

  const [ hashObj, setHashObj ] = useState(null);

  const connectionEndEvent = async () => {
    router.push('/incognito')
  }

  const webRtc = useWebRtc({
    setIsConnected: setConnectionIsEstablished, 
    setRecipientPeerId : setRemotePeerDetails, 
    emitHash: setHashObj, 
    onDisconnect: _ => connectionEndEvent(true)
  });

  const initPeerJs = useCallback(async () => {
    if( !isInitializer ) {
      webRtc.init({ emitPeerDetails: setSelfPeerDetails, connectionType: 'dataChannel', isInitializer: false, onMessage });
      
    } else {
      webRtc.init({ emitPeerDetails: setSelfPeerDetails, connectionType: 'dataChannel', isInitializer: true, onMessage, recipientDetails: { id: otherPeerId, secret: otherPeerSecret }});
    }
    setIsInitialized(true)
  }, [ isInitializer, webRtc, otherPeerId, otherPeerSecret ])

  useEffect( _ => {
    if ( !isInitialized ) initPeerJs();
  }, [ isInitialized, initPeerJs ]);

  const onMessage = (message) => {
    setCurrentMessage(message);
  }

  return (
    <AnimatePresence exitBeforeEnter>
      {
        !connectionIsEstablished ? 
        <MotionWrapper><IncognitoWaitingDisplay calling={ isInitializer } selfId={ selfPeerDetails?.id } selfSecret={ selfPeerDetails?.secret } /></MotionWrapper> :
        <MotionWrapper><FileManager 
          message={ currentMessage }
          clearMessage={ _ => setCurrentMessage(null) }
          sendMessage={ webRtc.sendMessage }
          hashObj={ hashObj }
        /></MotionWrapper>
      }
    </AnimatePresence>
  )
}

export default IncognitoCallManager
