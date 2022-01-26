import { useEffect, useState, useRef } from 'react'
import WebRtc from '@amir4rab/web-rtc-connector-client';


function useWebRtc({ setCallIsAnswered, setRecipientPeerId, emitHash= null, onDisconnect= null, setCanUpdateMedia= null, onStream= null }) {
  const [ peerId, setPeerId ] = useState(null);
  const [ hashObj, setHashObj ] = useState(null);
  const [ isInitialized, setIsInitialized ] = useState(false);
  const webRtcRef = useRef(null);
  const connectionState = useRef(false);
  const selfStreamRef = useRef(null);
  const [ callDetails, setCallDetails ] = useState();

  const init = async ( stream, emitPeerDetails= null, calling= false, recipientDetails= null ) => {
    selfStreamRef.current = stream;
    // localPeerVideoRef.current = peerVideoRef;
    setCallDetails({
      calling,
      id: recipientDetails !== null ? recipientDetails?.id : null,
      secret: recipientDetails !== null ? recipientDetails?.secret : null,
    })

    webRtcRef.current = new WebRtc({
      serverUrl: 'localhost:5001',
      onPeerConnection: _ => setCallIsAnswered(true)
    });
    // webRtcRef.current = webRtc;
    webRtcRef.current.on('onConnection', id => {
      console.log('self id:', id)
      setPeerId( id )
      if ( emitPeerDetails !== null ) emitPeerDetails( id );
    });

    //** events **//
    webRtcRef.current.on( 'onClose', _ => {
      connectionState.current = false;
      onDisconnect && onDisconnect()
    });
    webRtcRef.current.on ( 'onError', _ => {
      connectionState.current = false;
      onDisconnect && onDisconnect()
    });
    webRtcRef.current.on( 'onConnectionToRecipient', id => {
      console.log('Connection to recipient has been established!');
      setRecipientPeerId(id);
      connectionState.current = true;
    });

    //** after connection events **//
    webRtcRef.current.on('onStream', peerStream => {
      onStream && onStream(peerStream);
      setCallIsAnswered(true);
    });
    webRtcRef.current.on('descriptionsCompleted', async ({ hashObj }) => {
      setHashObj(hashObj)
      console.log(hashObj, emitHash)
      if ( emitHash !== null ) {
        emitHash(hashObj)
      }
      setCanUpdateMedia && setCanUpdateMedia(webRtcRef.current.canUpdateMedia());
    });
  }

  useEffect( _ => {
    if( peerId === null || isInitialized ) return;
    if ( !callDetails.calling ) { //** user is Answering **//
      webRtcRef.current.answerMediaConnection( selfStreamRef.current );
    } else { //** user is Calling **//
      webRtcRef.current.makeMediaConnection( selfStreamRef.current, { id: callDetails.id, secret: callDetails.secret } )
    }
    setIsInitialized(true);
  }, [ peerId, callDetails, selfStreamRef, isInitialized, setCallIsAnswered ]);

  useEffect(_ => {
    return () => {
      console.error('Disconnecting Webrtc')
      webRtcRef.current && webRtcRef.current.close();
    }
  }, [])

  const updateMedia = async ( newStreamRef ) => {
    selfStreamRef.current = newStreamRef
    console.log(newStreamRef)
    await webRtcRef.current.updateMedia( newStreamRef );
  }

  return ({
    init,
    id: peerId,
    hashObj,
    updateMedia
  })
}

export default useWebRtc;
