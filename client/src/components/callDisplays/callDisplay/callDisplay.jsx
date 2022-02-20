import { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { useRouter } from 'next/router';

import { useMediaManager } from '../../../utils/frontend/camera/useMediaManager';
import useWebRtc from '../../../utils/hooks/useWebrtc';
import { SocketsContext } from '../../../providers/socketsProvider/socketsProvider';
import { ContactsContext } from '../../../providers/contactsProvider/contactsProvider';
import useTranslation from 'next-translate/useTranslation';
import CallElements from '../callElements/callElements';

function CallDisplay({ callTo, calling, audioOnly = false, setCallStartTime, setCallEnded }) {
  const { t } = useTranslation('callDisplay');
  const {
    call,
    receivingCall,
    socket,
    endCallEvent: endCallSocketEvent,
  } = useContext(SocketsContext)
  const {
    getContact
  } = useContext(ContactsContext)

  const router = useRouter();
  const selfVideoRef = useRef();
  const peerVideoRef = useRef();
  
  const [ isAudio, setIsAudio ] = useState(true);

  const [ peerId, setPeerId ] = useState(null);
  const [ otherPeerId, setOtherPeerId ] = useState(null);

  const [ callIsAnswered, setCallIsAnswered ] = useState(false);

  const [ isInitialized, setIsInitialized ] = useState(false);
  const [ isCalled, setIsCalled ] = useState(false);

  const [ hashObj, setHashObj ] = useState(null);
  const [ canUpdateMedia, setCanUpdateMedia ] = useState(null);

  const onStream = ( peerStream ) => {
    peerVideoRef.current.srcObject = peerStream;
    peerVideoRef.current.onLoadedMetadata = e => e.target.play()
  }

  const { changeMedia, mediaStreamRef, mediaIsGranted, currentVideoRes, updateVideoResolution } = useMediaManager({ videoRef: selfVideoRef, audioOnly: audioOnly });
  const peer = useWebRtc({ 
    peerVideoRef: peerVideoRef.current, 
    setIsConnected: setCallIsAnswered, 
    setRecipientPeerId: setOtherPeerId, 
    emitHash: setHashObj, 
    onDisconnect: setCallEnded,
    setCanUpdateMedia,
    onStream
  });

  const initPeerJs = useCallback(async () => {
    console.log(mediaStreamRef.current);
    if( calling === 'true' ) {
      peer.init({ stream: mediaStreamRef.current, emitPeerDetails: setPeerId, isInitializer: false });
    } else {
      peer.init({ stream: mediaStreamRef.current, emitPeerDetails: setPeerId, isInitializer: true, recipientDetails: receivingCall.peerJsId });
      setOtherPeerId(receivingCall.peerJsId)
    }
    setIsInitialized(true)
  }, [ calling, mediaStreamRef, setPeerId, receivingCall, peer ])

  const initCall = useCallback(async () => {
    if( calling === 'true' && !isCalled ) {
      call( peerId, callTo, audioOnly ? 'audio' : 'video' );
      setIsCalled(true);
    }
  }, [ call, callTo, calling, peerId, isCalled, audioOnly ])

  useEffect( _ => {
    if( mediaIsGranted && !isInitialized ) initPeerJs();
  }, [ mediaIsGranted, initPeerJs, isInitialized ])

  useEffect( _ => {
    if ( peerId !== null && socket !== null ) initCall();
  }, [ peerId, socket, initCall ]);


  useEffect( _ => {
    if ( callIsAnswered ) {
      const currentDate = new Date();
      setCallStartTime(currentDate.valueOf());
    }
  }, [ callIsAnswered, setCallStartTime ]);

  const endCallEvent = async () => {
    await endCallSocketEvent( callTo, 'ended' );
    router.push('/panel');
  }

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
    <CallElements 
      callTo={ callTo } 
      calling={ calling } 
      hashObj={ hashObj } 
      callIsAnswered={ callIsAnswered } 
      selfVideoRef={ selfVideoRef } 
      peerVideoRef={ peerVideoRef } 
      audioOnly={ audioOnly } 
      changeMedia={ changeMedia } 
      isAudio={ isAudio } 
      setIsAudio={ setIsAudio } 
      endCallEvent={ endCallEvent }
      recipientName={ getContact(callTo).name.slice(0, 1) }
      canUpdateMedia={ canUpdateMedia }
      updateVideoResolution={ updateVideoSettings }
      currentVideoRes={ currentVideoRes }
    />
  )
}

export default CallDisplay;