import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';

function DeviceDetector({ setData }) {
  const [ isInitialized, setIsInitialized ] = useState(false); 

  useEffect( _ => {
    if ( !isInitialized ) {
      setData(isMobile);
      setIsInitialized(true);
    }
  }, [ setData, isInitialized ])

  return (<></>)
}

export default DeviceDetector
