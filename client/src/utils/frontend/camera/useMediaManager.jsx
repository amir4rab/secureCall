import { useRef, useState, useEffect, useCallback } from 'react';

const shareDisplaySettings = {
  video: {
    height: 360,
    width: 640,
    aspectRatio: 1.777777778,
    frameRate: { max: 24 },
  },
  audio: true
};

export const useMediaManager = ({ videoRef, audioOnly = false, requestedMedia = 'camera' }) => {
  const [ mediaIsGranted, setMediaIsGranted ] = useState(false);
  const [ mediaSettings, setMediaSettings ] = useState({
    video: audioOnly ? false : {
      height: 360,
      width: 640,
      aspectRatio: 1.777777778,
      facingMode: "user",
      frameRate: { max: 24 },
    },
    audio: true
  })

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
        // track.stop();
        removeTrack(track);
      });
    } else {
      const tracks = await outputStreamRef.current?.getTracks();
      tracks?.forEach( track => {
        // track.stop();
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
  }, [])

  const getMedia = useCallback(( addToStream = false ) => new Promise( async ( resolve, reject ) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(mediaSettings);
      mediaStreamRef.current = mediaStream;
      if( addToStream ) {
        mediaStream?.getTracks().forEach( track => {
          addTrack(track)
        });
        setMediaIsGranted(true);
      }
      resolve(true); 
    } catch(err) {
      console.error('Some thing went wrong when accessing camera!', err);
      resolve(false);
    }
  }), [ mediaSettings ]);

  const getDisplayMedia = useCallback(( addToStream = false ) => new Promise( async ( resolve, reject ) => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia(shareDisplaySettings);
      displayMediaRef.current = mediaStream;
      if( addToStream ) {
        mediaStream?.getTracks().forEach( track => {
          addTrack(track)
        });
        setMediaIsGranted(true);
      }
      resolve(true);
    } catch(err) {
      console.error('Some thing went wrong when requesting display capture!', err);
      resolve(false);
    }
  }), []);

  const switchToDisplay = async () => {
    const getDisplayMediaResult = await getDisplayMedia();
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
        console.log(track);
        addTrack(track);
    });
  }

  useEffect( _ => {
    generateMedia();
    if ( requestedMedia === 'camera' ) {
      if( mediaStreamRef.current === null )  getMedia(true)
    } else {
      if( displayMediaRef.current === null )  getDisplayMedia(true)
    };
    return () => {
      closeMedia();
    }
  }, [ getMedia, getDisplayMedia, requestedMedia, generateMedia, closeMedia ]);

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
        resolve(true);
        break;
      }
      case 'camera': {
        let label = 'null';
        mediaStreamRef.current?.getTracks()?.forEach(track => {
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
        resolve(true);
        break;
      }
      case 'switchToCamera': {
        await switchToCamera();
        resolve(true);
        break;
      }
      case 'switchToDisplay': {
        await switchToDisplay();
        resolve(true);
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
    logOutput
  })
};

export default useMediaManager;