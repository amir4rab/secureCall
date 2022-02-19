import { useEffect, useRef, useState } from 'react';

const useWindowResize = () => {
  const [ size, setSize ] = useState([0, 0]);
  const resizeListenerRef =  useRef(null);

  useEffect(_ => {
    if( typeof window === 'undefined' ) return;
    resizeListenerRef.current = () => {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', resizeListenerRef.current );
    resizeListenerRef.current();
    return () => resizeListenerRef.current && window.removeEventListener('resize', resizeListenerRef.current );
  }, [])

  return size;
}

export default useWindowResize