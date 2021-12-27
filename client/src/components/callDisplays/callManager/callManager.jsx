import { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { SocketsContext } from '../../../providers/socketsProvider/socketsProvider';
import EndedDisplay from '../endedDisplay/endedDisplay';
import LoadingDisplay from '../../loadingAnimation/loadingDisplay';

const DynamicVideoCall = dynamic(
  () => import('../videoCall/videoCall'),
  { 
    ssr: false,
    loading: () => <LoadingDisplay />,
  }
)

function CallManager({ callTo, calling, callType }) {
  const [ callHaveEnded, setCallHaveEnded ] = useState(false); 
  const [ lastCallIsCleared, setLastCallIsCleared ] = useState(false);
  const { callEnded, clearCallingInfo, clearEndedCall } = useContext(SocketsContext);

  useEffect( _ => {
    clearEndedCall();
    setLastCallIsCleared(true);
  }, [ clearEndedCall ])

  useEffect(() => {
    if( callEnded && lastCallIsCleared ) {
      clearCallingInfo();
      setCallHaveEnded(true);
    }
  }, [ callEnded, clearCallingInfo, lastCallIsCleared ])

  return (
    <>
      {
        callHaveEnded ? 
        <EndedDisplay email={ callTo } /> 
        :
        <DynamicVideoCall audioOnly={ callType === 'audio' } callTo={ callTo } calling={ calling } />
      }
    </>
  )
}

export default CallManager
