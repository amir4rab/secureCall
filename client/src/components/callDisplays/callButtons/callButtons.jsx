import { useState } from 'react';

import { IoMic, IoMicOff, IoVideocam, IoVideocamOff, IoVolumeHigh, IoVolumeMute, IoDesktop } from 'react-icons/io5';

import useTranslation from 'next-translate/useTranslation';

import classes from './callButtons.module.scss';

function CallButtons({ changeMedia, isAudio, setIsAudio, endCall, audioOnly = false, initialVideoStream = 'camera' }) {
  const [ microphoneState, setMicrophoneState ] = useState(true);
  const [ cameraState, setCameraState ] = useState(true);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ videoStream, setVideoStream ] = useState(initialVideoStream);
  const { t } = useTranslation('callDisplay');

  const toggleAudio = async () => {
    setIsLoading(true);
    const successful = await changeMedia('audio', !microphoneState );
    if ( successful) setMicrophoneState(!microphoneState)
    setIsLoading(false);
  };

  const toggleVideo = async () => {
    setIsLoading(true);
    const successful = await changeMedia('camera', !cameraState );
    if ( successful) setCameraState(!cameraState)
    setIsLoading(false);
  };

  // const toggleSharedMedia = async () => {
  //   if ( videoStream === 'camera' ) {
  //     await changeMedia('switchToDisplay');
  //     setVideoStream('display')
  //   } else if ( videoStream === 'display' ) {
  //     await changeMedia('switchToCamera');
  //     setVideoStream('camera')
  //   }
  // }

  return (
    <div className={ classes.callButtons }>
      <div className={ classes.left }>
        <button
          disabled={ isLoading }
          onClick={ toggleAudio }
          className={[ classes.controlBtn, microphoneState ? classes.active : classes.inactive ].join(' ')}  
        >
          <IoMic className={ classes.activeImg }/>
          <IoMicOff className={ classes.inactiveImg }/>
          <div className={ classes.hint }>
            { cameraState ? t('mute') : t('unmute') }
          </div>
        </button>
        <button 
          disabled={ isLoading || videoStream !== 'camera' }
          onClick={ toggleVideo }
          className={[ classes.controlBtn, cameraState ? classes.active : classes.inactive, audioOnly ? classes.hidden : null ].join(' ')}  
        >
          <IoVideocam className={ classes.activeImg }/>
          <IoVideocamOff className={ classes.inactiveImg }/>
          <div className={ classes.hint }>
            { cameraState ? t('cameraOff') : t('cameraOn') }
          </div>
        </button>
        <button 
          disabled={ isLoading }
          onClick={ _ => setIsAudio(!isAudio) }
          className={[ classes.controlBtn, isAudio ? classes.active : classes.inactive ].join(' ')}  
        >
          <IoVolumeHigh className={ classes.activeImg }/>
          <IoVolumeMute className={ classes.inactiveImg }/>
          <div className={ classes.hint }>
            { isAudio ? t('audioOff') : t('audioOn') }
          </div>
        </button>
        {/* <button 
          disabled={ isLoading }
          onClick={ _ => toggleSharedMedia() }
          className={[ classes.controlBtn, videoStream !== 'display' ? classes.active : classes.inactive ].join(' ')}  
        >
          <IoDesktop className={ classes.activeImg }/>
          <IoVideocam className={ classes.inactiveImg }/>
          <div className={ classes.hint }>
            { initialVideoStream !== 'display' ? 'share your screen' : 'share your camera' }
          </div>
        </button> */}
      </div>
      <div className={ classes.right }>
        <button onClick={ endCall } className={ classes.buttonRed }>
          { t('endCall') }
        </button>
      </div>
    </div>
  )
}

export default CallButtons
