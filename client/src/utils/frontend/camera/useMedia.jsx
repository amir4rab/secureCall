import { useRef, useState, useEffect, useCallback } from 'react';


export const useMedia = ( videoRef, audioOnly = false ) => {
  const [ mediaIsGranted, setMediaIsGranted ] = useState(false);
  const [ mediaSettings, setMediaSettings ] = useState({
    video: audioOnly ? false : {
      height: 360,
      width: 640,
      facingMode: "user",
      aspectRatio: ""
    },
    audio: true
  })
  const mediaStreamRef = useRef(null);

  const getMedia = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(mediaSettings);
      videoRef.current.srcObject = mediaStream;
      mediaStreamRef.current = mediaStream;
      setMediaIsGranted(true);
    } catch {
      console.error('Some thing went wrong when accessing camera!')
    }
  }, [ mediaSettings, videoRef ])

  const closeMedia = () => {
    mediaStreamRef.current?.getTracks()?.forEach( track => {
      track.stop();
    });
  }

  useEffect( _ => {
    if( mediaStreamRef.current === null )  getMedia();
    return () => {
      closeMedia();
    }
  }, [ getMedia ]);

  const changeMedia = async ( changedItem, newValue ) => {
    switch( changedItem ) {
      case 'audio': {
        mediaStreamRef.current.getTracks().forEach(track => {
          if( track.kind === 'audio' ) {
            track.enabled = newValue
          }
        });
        break;
      }
      case 'camera': {
        mediaStreamRef.current.getTracks().forEach(track => {
          if( track.kind === 'video' ) {
            track.enabled = newValue
          }
        });
        break;
      }
    }
  }

  return ([
    changeMedia,
    mediaStreamRef,
    mediaIsGranted,
    closeMedia
  ])
};

export default useMedia;