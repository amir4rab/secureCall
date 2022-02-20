import { useEffect, useState, useRef } from 'react'
import WebRtc from '@amir4rab/web-rtc-connector-client';


function useWebRtc({ setIsConnected= null, setRecipientPeerId, emitHash= null, onDisconnect= null, setCanUpdateMedia= null, onStream= null }) {
  const [ peerId, setPeerId ] = useState(null);
  const [ hashObj, setHashObj ] = useState(null);
  const [ isInitialized, setIsInitialized ] = useState(false);
  const webRtcRef = useRef(null);
  const selfStreamRef = useRef(null);
  const connectionTypeRef = useRef(null);
  const connectionState = useRef(false);
  const [ sessionDetails, setSessionDetails ] = useState();

  const init = async ({ stream= null, emitPeerDetails= null, isInitializer= false, recipientDetails= null, connectionType= 'stream', onMessage= null }) => {
    selfStreamRef.current = stream;
    connectionTypeRef.current = connectionType;
    setSessionDetails({
      isInitializer,
      id: recipientDetails !== null ? recipientDetails?.id : null,
      secret: recipientDetails !== null ? recipientDetails?.secret : null,
    })

    webRtcRef.current = new WebRtc({
      serverUrl: 'localhost:5001',
      // onPeerConnection: _ => setIsConnected(true)
    });

    webRtcRef.current.on('onConnection', id => {
      console.log('self id:', id)
      setPeerId( id )
      if ( emitPeerDetails !== null ) emitPeerDetails( id );
    });

    //** events global events **//
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

    // console.error()
    //** after-stream connection events **//
    if ( connectionType === 'stream' ) webRtcRef.current.on('onStream', peerStream => {
      onStream && onStream(peerStream);
      setIsConnected(true);
    });

    //** after-dataChannel connection events **//
    if ( connectionType === 'dataChannel' )  {
      webRtcRef.current.on( 'onDataChannel', () => {
        console.log('connected!')
        setIsConnected(true);
      });
      
      webRtcRef.current.on( 'onMessage', message => {
        onMessage && onMessage(message);
      });
    }

    webRtcRef.current.on('descriptionsCompleted', async ({ hashObj }) => {
      setHashObj(hashObj)
      if ( emitHash !== null ) {
        emitHash(hashObj)
      }
      setCanUpdateMedia && setCanUpdateMedia(webRtcRef.current.canUpdateMedia());
    });
  }

  useEffect( _ => {
    if( peerId === null || isInitialized ) return;

    if ( connectionTypeRef.current === 'stream' ) {
      if ( !sessionDetails.isInitializer ) { //** user is Answering **//
        webRtcRef.current.answerMediaConnection( selfStreamRef.current );
      } else { //** user is Calling **//
        webRtcRef.current.makeMediaConnection( selfStreamRef.current, { id: sessionDetails.id, secret: sessionDetails.secret } )
      }
    } else {
      console.error(sessionDetails.isInitializer)
      if ( sessionDetails.isInitializer ) {
        webRtcRef.current.dataConnection({ id: sessionDetails.id, secret: sessionDetails.secret });
      }
    }
    setIsInitialized(true);
  }, [ peerId, sessionDetails, isInitialized, setIsConnected ]);

  useEffect(_ => {
    return () => {
      console.error('Disconnecting Webrtc')
      webRtcRef.current && webRtcRef.current.close();
    }
  }, [])

  const updateMedia = async ( newStreamRef ) => {
    if ( connectionTypeRef.current !== 'stream' ) {
      console.warn('Media update is only possible on Stream connections')
      return;
    }
    selfStreamRef.current = newStreamRef
    await webRtcRef.current.updateMedia( newStreamRef );
  }

  const sendMessage = async ( message ) => {
    if ( connectionTypeRef.current !== 'dataChannel' ) {
      console.warn('send Message is only possible on dataChannel connections')
      return;
    }
    webRtcRef.current.sendMessage(message);
  }

  return ({
    init,
    id: peerId,
    hashObj,
    updateMedia,
    sendMessage
  })
}

export default useWebRtc;
