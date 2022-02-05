import { useRef, useState, useEffect, useCallback } from 'react';

const videoQuality = {
  low: {
    height: 480,
    width: 640,
  },
  medium: {
    height: 720,
    width: 1280,
  },
  high: {
    height: 1080,
    width: 1920,
  },
  ultra: {
    height: 1440,
    width: 2560,
  },
  insane: {
    height: 2160,
    width: 3840,
  }
}

const shareDisplayDefaultSettings = {
  video: {
    ...videoQuality.low,
    aspectRatio: 1.777777778,
    frameRate: { max: 24 },
  },
  audio: true
};

const generateShareDisplaySettings = ( resolution = 'medium', maxFramerate= 24 , includeAudio= false ) => {
  if ( typeof resolution !== 'string' && typeof maxFramerate === 'number' && typeof includeAudio !== 'boolean' ) {
    console.error('generateShareDisplaySettings received false inputs');
    return shareDisplayDefaultSettings;
  }

  let isValidResolution = false
  Object.keys(videoQuality).forEach( videoQuality => {
    if ( videoQuality === resolution ) isValidResolution = true;
  })
  if ( !isValidResolution ) {
    console.error('generateShareDisplaySettings received false resolution');
    return shareDisplayDefaultSettings;
  }

  return ({
    video: {
      ...videoQuality[resolution],
      aspectRatio: 1.777777778,
      frameRate: { max: maxFramerate },
    }, 
    audio: includeAudio
  })
}


export const useMediaManager = ({ videoRef, audioOnly = false, requestedMedia = 'camera', disabledByDefault= true }) => {
  const shareVideoSettings = useRef();
  const [ currentVideoRes, setCurrentVideoRes ] = useState('medium')
  const [ isInitialized, setIsInitialized ] = useState(false);
  const [ currentVideoTrack, setCurrentVideoTrack ] = useState(null);
  const [ cameraIsGranted, setCameraIsGranted ] = useState(false);
  const [ AudioIsGranted, setAudioIsGranted ] = useState(false);
  const [ mediaIsGranted, setMediaIsGranted ] = useState(false);
  const [ mediaSettings, setMediaSettings ] = useState({
    video: audioOnly ? false : {
      height: 360,
      width: 640,
      aspectRatio: 1.777777778,
      facingMode: "user",
      enabled: false,
      frameRate: { max: 24 },
    },
    audio: {
      enabled: false,
    }
  });

  const mediaStreamRef = useRef(null);
  const displayMediaRef = useRef(null);
  const outputStreamRef = useRef(null);

  const generateMedia = useCallback( _ => {
    const stream = new MediaStream();
    outputStreamRef.current = stream;
    videoRef.current.srcObject = stream;
  }, [ videoRef ]);

  const addTrack = ( track ) => {
    outputStreamRef.current?.addTrack(track)
  };
  
  const removeTrack = ( track ) => {
    outputStreamRef.current?.removeTrack(track)
  };

  const removeAllTracks = async ( videoOnly = false ) => {
    if ( videoOnly ) {
      const videoTracks = await outputStreamRef.current?.getVideoTracks();
      videoTracks?.forEach( track => {
        removeTrack(track);
      });
    } else {
      const tracks = await outputStreamRef.current?.getTracks();
      tracks?.forEach( track => {
        removeTrack(track);
      });
    }
  }

  const closeMedia = useCallback(( mediaType = 'all' ) => {
    if ( mediaType === 'media' || mediaType === 'all' ) {
      mediaStreamRef.current?.getTracks()?.forEach( track => {
        removeTrack(track)
        track.stop();
        mediaStreamRef.current.removeTrack(track);
      });
      mediaStreamRef.current = null;
    };
    if ( mediaType === 'displayMedia' || mediaType === 'all' ){ 
      displayMediaRef.current?.getTracks()?.forEach( track => {
        removeTrack(track)
        track.stop();
        displayMediaRef.current.removeTrack(track);
      });
      displayMediaRef.current = null;
    };
  }, []);

  const getMedia = useCallback(( addToStream = false ) => new Promise( async ( resolve, reject ) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(mediaSettings);
      mediaStreamRef.current = mediaStream;

      if( addToStream ) {
        mediaStream?.getTracks().forEach( track => {
          track.enabled = !disabledByDefault;
          addTrack(track)
        });
        setMediaIsGranted(true);
      }
      setCurrentVideoTrack('webcam');
      resolve(true); 
    } catch(err) {
      console.error('Some thing went wrong when accessing camera!', err);
      resolve(false);
    }
  }), [ mediaSettings, disabledByDefault ]);

  const getDisplayMedia = useCallback(( addToStream = false ) => new Promise( async ( resolve, reject ) => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia(shareVideoSettings.current);
      displayMediaRef.current = mediaStream;
      if( addToStream ) {
        mediaStream?.getTracks().forEach( track => {
          addTrack(track)
        });
        setMediaIsGranted(true);
      }
      setCurrentVideoTrack('display');
      resolve(true);
    } catch(err) {
      console.error('Some thing went wrong when requesting display capture!', err);
      resolve(false);
    }
  }), []);

  const switchToDisplay = async () => {
    const getDisplayMediaResult = await getDisplayMedia( false );
    if ( !getDisplayMediaResult ) return false;

    await removeAllTracks(true);

    const webcamTrack = await mediaStreamRef.current?.getVideoTracks();
    webcamTrack?.forEach( track => {
      track.enabled = false;
    });

    const displayTracks = await displayMediaRef.current?.getTracks();
    displayTracks?.forEach( track => {
      addTrack(track);
    });
    return true;
  };

  const switchToCamera = async () => {
    let mediaResults = true;
    if ( mediaStreamRef.current === null ) {
      console.log('Getting media')
      mediaResults = await getMedia();
    }
    if ( !mediaResults ) return false;

    await removeAllTracks(true);

    const displayTracks = await displayMediaRef.current?.getTracks();
    displayTracks?.forEach( track => {
      track.stop();
      displayMediaRef.current.removeTrack(track);
    });

    const mediaTracks = await mediaStreamRef.current?.getVideoTracks();
    mediaTracks?.forEach( track => {
        track.enabled = true;
        addTrack(track);
    });
    return true;
  }

  const clearCurrentDisplayTracks = async () => {
    displayMediaRef.current && displayMediaRef.current?.getTracks()?.forEach( track => {
      removeTrack(track);
      track.stop();
      displayMediaRef.current.removeTrack(track);
    });
  }

  const updateVideoResolution = async ( resolution ) => {
    shareVideoSettings.current = generateShareDisplaySettings( resolution );
    setCurrentVideoRes(resolution);
    if ( currentVideoTrack !== 'display' ) return false; 
    await clearCurrentDisplayTracks();
    const response = await getDisplayMedia(true);
    if ( response ) {
      return outputStreamRef.current
    } else {
      return false;
    }
  }

  useEffect( _ => {
    if ( !isInitialized ) {
      console.log('getting Media')
      shareVideoSettings.current = generateShareDisplaySettings()
      generateMedia();
      if ( requestedMedia === 'camera' ) {
        if( mediaStreamRef.current === null )  getMedia(true)
      } else {
        if( displayMediaRef.current === null )  getDisplayMedia(true)
      };
      setIsInitialized(true)
    }
    return () => {
      closeMedia();
    }
  }, [ getMedia, getDisplayMedia, requestedMedia, generateMedia, closeMedia, isInitialized ]);

  const changeMedia = ( changedItem, newValue ) => new Promise( async ( resolve, reject ) => {
    if ( mediaStreamRef.current === null ) {
      resolve(false);
      return;
    }
    switch( changedItem ) {
      case 'audio': {
        let label = 'null';
        mediaStreamRef.current?.getTracks()?.forEach(track => {
          if( track.kind === 'audio' ) {
            label = track.label;
            console.log(track.label);
            track.enabled = newValue
          }
        });
        outputStreamRef.current?.getTracks()?.forEach(track => {
          if ( track.label === label ) {
            track.enabled = newValue
          }
        })
        resolve(outputStreamRef.current);
        break;
      }
      case 'video': {
        let label = 'null';
        mediaStreamRef.current?.getTracks()?.forEach(track => {
          if( track.kind === 'video' ) {
            label = track.label
            track.enabled = newValue
          }
        });
        displayMediaRef.current?.getTracks()?.forEach(track => {
          if( track.kind === 'video' ) {
            label = track.label
            track.enabled = newValue
          }
        });
        outputStreamRef.current?.getTracks()?.forEach(track => {
          if ( track.label === label ) {
            track.enabled = newValue
          }
        })
        resolve(outputStreamRef.current);
        break;
      }
      case 'switchToCamera': {
        const result = await switchToCamera();
        result === true ? resolve(outputStreamRef.current) : resolve(false);
        break;
      }
      case 'switchToDisplay': {
        const result = await switchToDisplay();
        result === true ? resolve(outputStreamRef.current) : resolve(false);
        break;
      }
    }
  });

  const logOutput = async () => {
    const tracks = await outputStreamRef.current?.getTracks();
    tracks?.forEach( track => {
      console.log(track);
    });
  };


  return ({
    changeMedia,
    mediaStreamRef,
    mediaIsGranted,
    closeMedia,
    logOutput,
    updateVideoResolution,
    currentVideoRes
  })
};

export default useMediaManager;