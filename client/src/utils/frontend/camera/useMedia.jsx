import { useRef, useState, useEffect } from 'react';

const defaultMediaOptions = {
  audio: true,
  video: {
    height: 360,
    width: 640,
    facingMode: "user",
    aspectRatio: ""
  }
}

export const useMedia = ( videoRef,  mediaOptions = defaultMediaOptions ) => {
  const [ mediaIsGranted, setMediaIsGranted ] = useState(false);
  const [ cameraSettings, setCameraSettings ] = useState(mediaOptions.video);
  const [ audioSettings, setAudioSettings ] = useState(mediaOptions.audio);
  const [ mediaSettings, setMediaSettings ] = useState({
    video: mediaOptions.video,
    audio: mediaOptions.audio
  })
  const [ cachedCameraSettings, setCachedCameraSettings ] = useState(null);
  const mediaStreamRef = useRef(null);
  const [ stream, setStream ] = useState(null)
  // const [ mediaStream, setMediaStream ] = useState(null);

  const getMedia = async ( settings = mediaSettings ) => {
    try {
      mediaStreamRef.current?.getTracks()?.forEach( track => {
        // console.log('track stopped!')
        track.stop();
      });
      if( !cameraSettings && !audioSettings ) {
        videoRef.current.srcObject = null;
        mediaStreamRef.current = null;
        return;
      } else {
        console.log(cameraSettings, audioSettings)
        const mediaStream = await navigator.mediaDevices.getUserMedia(settings);
        videoRef.current.srcObject = mediaStream;
        mediaStreamRef.current = mediaStream;
        setMediaIsGranted(true);
        setStream(mediaStream);
        // console.log('MediaStream Started!');
      }
    } catch {
      console.error('Some thing went wrong when accessing camera!')
    }
  }

  useEffect( _ => {
    getMedia();
    return () => {
      mediaStreamRef.current?.getTracks()?.forEach( track => {
        track.stop();
      });
    }
  }, []);

  // useEffect( _ => {
  //   // console.log('here!');
  //   // getMedia({
  //   //   video: cameraSettings,
  //   //   audio: audioSettings
  //   // });
  //   setMediaSettings({
  //     video: cameraSettings,
  //     audio: audioSettings
  //   })
  // }, [ cameraSettings, audioSettings ])

  const changeMedia = async ( changedItem, newValue ) => {
    switch( changedItem ) {
      case 'audio': {
        console.log('new audio value: ', newValue)
        mediaStreamRef.current.getTracks().forEach(track => {
          if( track.kind === 'audio' ) {
            track.enabled = newValue
          }
        });

        setAudioSettings(newValue);
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
    mediaIsGranted
  ])
};

export default useMedia;