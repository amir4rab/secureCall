import { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { useRouter } from 'next/router';

import { useMediaManager } from '../../utils/frontend/camera/useMediaManager';
import useWebRtc from '../../utils/hooks/useWebrtc';

import useTranslation from 'next-translate/useTranslation';
import CallElements from '../callDisplays/callElements/callElements';
import IncognitoWaitingDisplay from './incognitoWaitingDisplay/incognitoWaitingDisplay';

function IncognitoCallManager({ otherPeerId, otherPeerSecret, isInitializer }) {
  const { t } = useTranslation('callDisplay');

  const router = useRouter();
  const selfVideoRef = useRef();
  const peerVideoRef = useRef();
  
  const [ isAudio, setIsAudio ] = useState(true);

  const [ selfPeerDetails, setSelfPeerDetails ] = useState(null);
  const [ remotePeerDetails, setRemotePeerDetails ] = useState(null);

  const [ callIsAnswered, setCallIsAnswered ] = useState(false);

  const [ isInitialized, setIsInitialized ] = useState(false);

  const [ hashObj, setHashObj ] = useState(null);
  const [ canUpdateMedia, setCanUpdateMedia ] = useState(null);

  const onStream = ( peerStream ) => {
    peerVideoRef.current.srcObject = peerStream;
    peerVideoRef.current.onLoadedMetadata = e => e.target.play()
  }

  const endCallEvent = async () => {
    router.push('/incognito')
  }

  const { changeMedia, mediaStreamRef, mediaIsGranted, updateVideoResolution, currentVideoRes } = useMediaManager({ videoRef: selfVideoRef });
  const webRtc = useWebRtc({ 
    peerVideoRef: peerVideoRef.current, 
    setIsConnected: setCallIsAnswered, 
    setRecipientPeerId: setRemotePeerDetails, 
    emitHash: setHashObj,
    onDisconnect: _ => endCallEvent(true),
    setCanUpdateMedia,
    onStream
  });

  const initPeerJs = useCallback(async () => {
    if( !isInitializer ) {
      webRtc.init({ stream: mediaStreamRef.current, emitPeerDetails: setSelfPeerDetails, isInitializer: false });
    } else {
      webRtc.init({ stream: mediaStreamRef.current, emitPeerDetails: setSelfPeerDetails, isInitializer: true, recipientDetails: { id: otherPeerId, secret: otherPeerSecret } });
    }
    setIsInitialized(true)
  }, [ isInitializer, mediaStreamRef, webRtc, otherPeerId, otherPeerSecret ])

  useEffect( _ => {
    if ( !isInitialized && mediaIsGranted ) initPeerJs();
  }, [ isInitialized, initPeerJs, mediaIsGranted ]);

  const updateMedia = async ( mediaMode ) => {
    const newStreamRef = await changeMedia(mediaMode);
    if( newStreamRef === false ) return;
    await webRtc.updateMedia( newStreamRef );
  };

  const updateVideoSettings = async ( newValue, updatedSetting ) => {
    let newStreamRef;
    if ( updatedSetting === 'resolution' ) {
      newStreamRef = await updateVideoResolution(newValue);
    }
    console.log( newStreamRef === false ) 
    if ( newStreamRef !== false ){
      await webRtc.updateMedia( newStreamRef );
    };
  }

  return (
    <div>
      <CallElements
        recipientName='Anonyms'
        calling={ isInitializer }
        hashObj={ hashObj }
        callIsAnswered={ callIsAnswered }
        selfVideoRef={ selfVideoRef }
        peerVideoRef={ peerVideoRef }
        audioOnly={ false }
        changeMedia={ changeMedia }
        updateMedia={ updateMedia }
        canUpdateMedia={ canUpdateMedia }
        isAudio={ isAudio }
        setIsAudio={ setIsAudio }
        endCallEvent={ endCallEvent }
        customWaitingElement={ <IncognitoWaitingDisplay calling={ isInitializer } selfId={ selfPeerDetails?.id } selfSecret={ selfPeerDetails?.secret } /> }
        updateVideoResolution={ updateVideoSettings }
        currentVideoRes={ currentVideoRes }
      />
    </div>
  )
}

export default IncognitoCallManager
