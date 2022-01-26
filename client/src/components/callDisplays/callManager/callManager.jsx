import { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import { SocketsContext } from '../../../providers/socketsProvider/socketsProvider';

import LoadingDisplay from '../../loadingAnimation/loadingDisplay';
import EndedDisplay from '../endedDisplay/endedDisplay';

const DynamicCallDisplay = dynamic(
  () => import('../callDisplay/callDisplay'),
  { 
    ssr: false,
    loading: () => <LoadingDisplay />,
  }
)

function CallManager({ callTo, calling, callType }) {
  const [ callHaveEnded, setCallHaveEnded ] = useState(false); 
  const [ lastCallIsCleared, setLastCallIsCleared ] = useState(false);
  const { callEnded, clearCallingInfo, clearEndedCall } = useContext(SocketsContext);
  const [ callStartTime, setCallStartTime ] = useState(null);

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
        <EndedDisplay callStartTime={ callStartTime } email={ callTo } /> 
        :
        <DynamicCallDisplay 
          setCallStartTime={ setCallStartTime } 
          audioOnly={ callType === 'audio' } 
          callTo={ callTo } 
          calling={ calling } 
          setCallEnded={ _ => setCallHaveEnded(true) } 
        />
      }
    </>
  )
}

export default CallManager
