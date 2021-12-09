import { useState } from 'react';

import classes from './callButtons.module.scss';

function CallButtons({ changeMedia }) {
  const [ microphoneState, setMicrophoneState ] = useState(true);
  const [ cameraState, setCameraState ] = useState(true);
  const [ isLoading, setIsLoading ] = useState(false);

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
          <img className={ classes.activeImg } src={ require('../../../../public/icons/white/microphone.svg').default.src } />
          <img className={ classes.inactiveImg } src={ require('../../../../public/icons/white/mMicrophone.svg').default.src } />
        </button>
        <button 
          disabled={ isLoading }
          onClick={ toggleVideo }
          className={[ classes.controlBtn, cameraState ? classes.active : classes.inactive ].join(' ')}  
        >
          <img className={ classes.activeImg } src={ require('../../../../public/icons/white/camera.svg').default.src } />
          <img className={ classes.inactiveImg } src={ require('../../../../public/icons/white/mCamera.svg').default.src } />
        </button>
      </div>
      <div className={ classes.right }>
        <button className={ classes.buttonRed }>
          end call
        </button>
      </div>
    </div>
  )
}

export default CallButtons
