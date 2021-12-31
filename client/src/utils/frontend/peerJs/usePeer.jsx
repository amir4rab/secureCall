import { useEffect, useState, useRef } from 'react'
import Peer from 'peerjs'

export const usePeer = ( peerVideoRef, setCallIsAnswered, setRecipientPeerId ) => {
  const [ peerId, setPeerId ] = useState(null);
  const [ isInitialized, setIsInitialized ] = useState(false);
  const peerRef = useRef(null);
  const callRef = useRef(null);
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
      console.log(`self id: ${id}`);
      emitPeerId( id );
    });
    peer.on( 'connection', conn => {
      conn.on('close', _ => console.log('Conn closed'))
    })
    peer.on('disconnected', _ => console.log('Disconnected!'))
    peer.on('close', _ => console.warn('Closed!'))
  }

  useEffect( _ => {
    if( peerId === null && !isInitialized ) return;
    if ( !callDetails.calling ) {
      // console.log(`peerJs onCall added!`)
      peerRef.current.on('call', call => {
        // console.log('Receiving call from peerJs');
        // console.log(`other peer id is: ${call.peer}`);
        setRecipientPeerId(call.peer);
        setCallIsAnswered(true);
        callRef.current = call;

        call.answer(selfStreamRef.current);

        call.on('stream', peerStream => {
          peerVideoRef.srcObject = peerStream;
        })
        call.on('close', _ => console.log('Closed 0!'))
      });

    } else {
      // console.log('Calling from peerJs');
      const call = peerRef.current.call( callDetails.recipientPeerId, selfStreamRef.current )
      call.on('stream', peerStream => {
        setCallIsAnswered(true);
        peerVideoRef.srcObject = peerStream;
      })
      call.on('close', _ => console.log('Closed 1!'))
      callRef.current = call;
    }
    setIsInitialized(true);
  }, [ peerId, callDetails, peerVideoRef, selfStreamRef, setCallIsAnswered, isInitialized, setRecipientPeerId ]);

  const peerCall = async ( recipientPeerId ) => {
    console.log( peerRef.current, peerId )
  }

  const destroy = () => {
    if ( callRef.current !== null ) {
      for (let conns in peerRef.current.connections) {
        peerRef.current.connections[conns].forEach((conn, index, array) => {
        console.log(`closing ${conn.connectionId} peerConnection (${index + 1}/${array.length})`, conn.peerConnection);
        conn.peerConnection.close();
        if (conn.close) {
          conn.close();
        }
        });
      }
    };
    if ( peerRef.current !== null ) peerRef.current.destroy();
    callRef.current= null;
    peerRef.current= null;
  }

  useEffect( _ => {
    return () => {
      destroy()
    }
  }, [ peerRef, callRef ]);

  return ({
    init,
    peerCall,
    id: peerId,
    destroy
  })
}