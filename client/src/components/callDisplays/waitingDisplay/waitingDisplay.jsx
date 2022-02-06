import { useState, useRef, useEffect, useContext } from 'react'

import { IoVolumeMute, IoVolumeMedium } from 'react-icons/io5';

import classes from './waitingDisplay.module.scss';

import useTranslation from 'next-translate/useTranslation';
import waitingAudio from './audio.json';
import { ContactsContext } from '../../../providers/contactsProvider/contactsProvider';

function WaitingDisplay({ callTo, mutedByDefault= false, isCalling }) {
  const { getContact } = useContext(ContactsContext);
  const [ isMuted, setIsMuted ] = useState(mutedByDefault);
  const audioRef = useRef();
  const { t } = useTranslation('waitingDisplay');
  const { t: tCallDisplay } = useTranslation('callDisplay');


  useEffect( _ => {
    if ( !mutedByDefault ) {
      audioRef.current.volume = 0.1;
      audioRef.current.play();
    }
  }, [ audioRef, mutedByDefault ]);

  return (
    <div className={ classes.waitingDisplay }>
      <div className={ classes.nameWrapper }>
        <div className={ classes.name }>
          { getContact(callTo).name.slice(0,1) }
        </div>
      </div>
      <div className={ classes.text }>
        { `${ isCalling ? t('calling') : t('connecting') } ${getContact(callTo).name}` }
      </div>
      <div className={ classes.buttonWrapper }>
        {
          !mutedByDefault ?
          <button onClick={ _ => setIsMuted(!isMuted) }>
            {
              isMuted ?
              <>
                <IoVolumeMute />
                <p>{tCallDisplay('audioOn')}</p>
              </>
              :
              <>
                <IoVolumeMedium />
                <p>{tCallDisplay('audioOff')}</p>
              </>
            }
          </button> : null
        }
      </div>
      <audio muted={ isMuted } ref={ audioRef } loop src={ waitingAudio.audio } />
    </div>
  )
}

export default WaitingDisplay
