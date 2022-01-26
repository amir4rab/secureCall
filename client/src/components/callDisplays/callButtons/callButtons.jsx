import { useState } from 'react';

import { IoMic, IoMicOff, IoVideocam, IoVideocamOff, IoVolumeHigh, IoVolumeMute, IoDesktop, IoCamera, IoSettings } from 'react-icons/io5';

import useTranslation from 'next-translate/useTranslation';

import VideoResolutionPopup from './videoResolutionPopup';

import classes from './callButtons.module.scss';

function CallButtons({
  changeMedia, isAudio, setIsAudio, endCall, audioOnly = false, initialVideoStream = 'camera', updateMedia, canUpdateMedia, updateVideoResolution
}) {
  const [ microphoneState, setMicrophoneState ] = useState(false);
  const [ cameraState, setCameraState ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ videoStream, setVideoStream ] = useState(initialVideoStream);
  const [ videoSettingsPopup, setVideoSettingsPopup ] = useState(false); 
  const { t } = useTranslation('callDisplay');

  const toggleAudio = async () => {
    setIsLoading(true);
    const successful = await changeMedia('audio', !microphoneState );
    if ( successful) setMicrophoneState(!microphoneState)
    setIsLoading(false);
  };

  const toggleVideo = async () => {
    setIsLoading(true);
    const successful = await changeMedia('video', !cameraState );
    if ( successful) setCameraState(!cameraState)
    setIsLoading(false);
  };

  const toggleSharedMedia = async () => {
    if ( videoStream === 'camera' ) {
      await updateMedia('switchToDisplay');
      setCameraState(true)
      setVideoStream('display')
    } else if ( videoStream === 'display' ) {
      await updateMedia('switchToCamera');
      setCameraState(true)
      setVideoStream('camera')
    }
  }

  return (
    <>
    <VideoResolutionPopup displayState={ videoSettingsPopup } setDisplayState={ setVideoSettingsPopup } updateVideoResolution={ updateVideoResolution } />
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
          onClick={ toggleVideo }
          className={[ classes.controlBtn, cameraState ? classes.active : classes.inactive, audioOnly ? classes.hidden : null ].join(' ')}  
        >
          <IoVideocam className={ classes.activeImg }/>
          <IoVideocamOff className={ classes.inactiveImg }/>
          <div className={ classes.hint }>
            { cameraState ? t('videoOff') : t('videoOn') }
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
        <button
          disabled={ isLoading }
          onClick={ _ => setVideoSettingsPopup(true) }
          className={[ classes.controlBtn, classes.active ].join(' ')}  
        >
          <IoSettings className={ classes.activeImg }/>
          <div className={ classes.hint }>
            { 'Settings' }
          </div>
        </button>
        {
          canUpdateMedia ? 
          <button 
            disabled={ isLoading }
            onClick={ _ => toggleSharedMedia() }
            className={[ classes.controlBtn, videoStream !== 'display' ? classes.active : classes.inactive ].join(' ')}  
          >
            <IoDesktop className={ classes.activeImg }/>
            <IoCamera className={ classes.inactiveImg }/>
            <div className={ classes.hint }>
              { initialVideoStream !== 'display' ? t('switchToDisplay') : t('switchToCamera') }
            </div>
          </button> : null
        }
      </div>
      <div className={ classes.right }>
        <button onClick={ endCall } className={ classes.buttonRed }>
          { t('endCall') }
        </button>
      </div>
    </div>
    </>
  )
}

export default CallButtons
