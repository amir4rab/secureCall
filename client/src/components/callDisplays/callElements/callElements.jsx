import useTranslation from 'next-translate/useTranslation';

import { AnimatePresence, motion } from 'framer-motion';

import CallButtons from '../callButtons/callButtons';
import WaitingDisplay from '../waitingDisplay/waitingDisplay';
import VerifyCall from '../../verifyCall/verifyCall';

import classes from './callElements.module.scss';

const fadeVariants = {
  visible: {
    opacity: 1
  },
  hidden: {
    opacity: 0
  }
};

function CallElements({ 
  callTo, recipientName, calling, hashObj, callIsAnswered, selfVideoRef, peerVideoRef, audioOnly, changeMedia, isAudio, setIsAudio, endCallEvent, customWaitingElement = null, updateMedia= null, canUpdateMedia= false, updateVideoResolution, currentVideoRes
}) {
  const { t } = useTranslation('callDisplay');

  const onLoadedMetadata = (e) => {
    e.target.play();
  };

  return (
    <div className={ classes.callElements }>
      <AnimatePresence> 
        { 
          callIsAnswered ? null : 
          <motion.div variants={ fadeVariants } initial='visible' animate='visible' exit='hidden'>
            { 
              customWaitingElement === null ? 
              <WaitingDisplay mutedByDefault={ calling  !== 'true' } callTo={ callTo } isCalling={ calling === 'true' } /> 
              :
              customWaitingElement
            }
          </motion.div>
        }
      </AnimatePresence>
      <VerifyCall hashObj={ hashObj } />
      <div className={[ !callIsAnswered ? classes.hidden : null, audioOnly ? classes.audioOnly : null ].join(' ')}>
        <div className={ classes.tagWrapper }>
          <div className={[ classes.nameTag, classes.recipientTag ].join(' ')}>
            { recipientName.slice(0, 1) }
          </div>
          <div className={[ classes.nameTag, classes.selfTag ].join(' ')}>
            {t('me')}
          </div>
        </div>
        <div className={ classes.selfVideoWrapper }>
          <video 
            className={ classes.selfVideo } 
            onLoadedMetadata={ onLoadedMetadata } 
            muted
            ref={ selfVideoRef } 
          />
        </div>
        <div className={ classes.recipientVideoWrapper }>
          <video
            className={ classes.recipientVideo } 
            onLoadedMetadata={ onLoadedMetadata }
            muted={ !isAudio }
            ref={ peerVideoRef }
          />
        </div>
      </div>
      <div className={ classes.buttons }>
        <CallButtons 
          updateMedia={ updateMedia } 
          canUpdateMedia={ canUpdateMedia } 
          audioOnly={ audioOnly } 
          endCall={ endCallEvent } 
          changeMedia={ changeMedia } 
          isAudio={ isAudio } 
          setIsAudio={ setIsAudio }
          updateVideoResolution={ updateVideoResolution }
          currentVideoRes={ currentVideoRes }
        />
      </div>
    </div>
  )
}

export default CallElements
