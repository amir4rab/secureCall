import { useEffect, useState, useRef } from 'react'
import Peer from 'peerjs'

export const usePeer = ( videoRef ) => {
  const [ peerId, setPeerId ] = useState(null);
  const [ peer, setPeer ] = useState(null);
  const selfStreamRef = useRef(null);
  // const [ call, setCall ] = useState(null);
  // const [ peerStream, setPeerStream ] = useState(null);
  // const [ selfStream, setSelfStream ] = useState(null);

  const init = async (stream, emitPeerId) => {
    console.log('here!', typeof window)
    selfStreamRef.current = stream;
    const peer = new Peer();
    setPeer(peer);
    peer.on('open', id => {
      setPeerId( id )
      emitPeerId( id );
    });
    peer.on('call', call => {
      call.answer(stream);
      call.on('stream', peerStream => {
        videoRef.current.srcObject = peerStream;
      })
    });
  }

  useEffect( _ => {
    // init()
    return () => {
      if ( peer !== null ) peer.destroy();
    }
  }, []);

  const call = async ( peerId ) => {
    const call = peer.call( peerId, selfStreamRef.current );
    call.on('stream', peerStream => {
      videoRef.current.srcObject = peerStream;
    })
  }


  return ({
    init,
    call,
    id: peerId
  })
}