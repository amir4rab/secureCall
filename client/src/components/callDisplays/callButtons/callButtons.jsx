import { useState } from 'react';

import { IoMic, IoMicOff, IoVideocam, IoVideocamOff, IoVolumeHigh, IoVolumeMute } from 'react-icons/io5';

import useTranslation from 'next-translate/useTranslation';

import classes from './callButtons.module.scss';

function CallButtons({ changeMedia, isAudio, setIsAudio, endCall, audioOnly = false }) {
  const [ microphoneState, setMicrophoneState ] = useState(true);
  const [ cameraState, setCameraState ] = useState(true);
  const [ isLoading, setIsLoading ] = useState(false);
  const { t } = useTranslation('callDisplay');

  const toggleAudio = async () => {
    await changeMedia('audio', !microphoneState );
    setMicrophoneState(!microphoneState)
  };

  const toggleVideo = async () => {
    await changeMedia('camera', !cameraState );
    setCameraState(!cameraState)
  };

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
          disabled={ isLoading }
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
