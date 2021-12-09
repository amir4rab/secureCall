import { useEffect, useState, useRef } from 'react'
import Peer from 'peerjs'

export const usePeer = ( peerVideoRef ) => {
  const [ peerId, setPeerId ] = useState(null);
  const peerRef = useRef(null);
  const selfStreamRef = useRef(null);
  const [ callDetails, setCallDetails ] = useState();

  const init = async ( stream, emitPeerId, calling = false, recipientPeerId = null ) => {
    selfStreamRef.current = stream;
    setCallDetails({
      calling,
      recipientPeerId
    })
    const peer = new Peer();
    peerRef.current = peer;
    peer.on('open', id => {
      setPeerId( id )
      emitPeerId( id );
    });
  }

  useEffect( _ => {
    if( peerId === null ) return;
    if ( !callDetails.calling ) {

      console.log(`peerJs onCall added!`)
      peerRef.current.on('call', call => {
        console.log('Receiving call from peerJs');
        call.answer(selfStreamRef.current);
        call.on('stream', peerStream => {
          peerVideoRef.srcObject = peerStream;
        })
      });

    } else {

      console.log('Calling from peerJs')
      const call = peerRef.current.call( callDetails.recipientPeerId, selfStreamRef.current )
      call.on('stream', peerStream => {
        peerVideoRef.srcObject = peerStream;
      })

    }
  }, [ peerId ])

  useEffect( _ => {
    return () => {
      if ( peerRef.current !== null ) peerRef.current.destroy();
    }
  }, []);

  const peerCall = async ( recipientPeerId ) => {
    console.log( peerRef.current, peerId )
  }


  return ({
    init,
    peerCall,
    id: peerId
  })
}