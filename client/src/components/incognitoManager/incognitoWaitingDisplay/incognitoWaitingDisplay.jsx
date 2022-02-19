import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

import { IoInformation, IoKey, IoPerson, IoGlobeOutline, IoHelp } from 'react-icons/io5';

import LoadingDisplay from '../../loadingAnimation/loadingDisplay';

import classes from './incognitoWaitingDisplay.module.scss';

import { fadeDown, fadeLeft, fadeRight, fadeUp } from '../../../animations/fade';
import IncognitoSelector from '../incognitoSelector/incognitoSelector';

import useTranslation from 'next-translate/useTranslation';

const fade = {
  visible: {
    opacity: 1
  },
  hidden: {
    opacity: 0
  }
}

function IncognitoWaitingDisplay({ selfSecret= null, selfId= null, calling }) {
  const copyToClipboard = ( input ) => {
    try {
      navigator.clipboard.writeText( input )
    } catch {
      console.error('Something went wrong, while copying text to clipboard!')
    }
  }

  const { t } = useTranslation('incognitoWaiting');

  if( calling ) return (
    <AnimatePresence>
      {
        selfSecret === null || selfId === null ? 
        <motion.div variants={ fade } initial='animate' animate='visible' exit='hidden' className={ classes.loadingWrapper }>
          <LoadingDisplay />
        </motion.div> : null
      }
    </AnimatePresence>
  )

  return (
    <AnimatePresence>
        {
          selfSecret === null || selfId === null ? 
          <motion.div variants={ fade } initial='animate' animate='visible' exit='hidden' className={ classes.loadingWrapper }>
            <LoadingDisplay />
          </motion.div> : null
        }
        {
          selfSecret !== null && selfId !== null ?
          <motion.div variants={ fade } initial='hidden' animate='visible' className={ classes.incognitoWaitingDisplay }>
            <div className={ classes.column }>
              <motion.h1 variants={ fadeUp } animate='visible' initial='hidden' className={ classes.title }>
                { t('title') }
              </motion.h1>
              <motion.div variants={ fadeLeft } animate='visible' initial='hidden'>
                <IncognitoSelector selfId={ selfId } selfSecret={ selfSecret } />
              </motion.div>
              <motion.div variants={ fadeDown } animate='visible' initial='hidden' className={ classes.footnote }>
                <IoInformation />
                <p>
                  { t('info') }
                </p>
              </motion.div>
            </div>
            <div className={ classes.column }>
              <motion.div variants={ fadeRight } animate='visible' initial='hidden'  className={ classes.helpBox }>
                <div className={ classes.helpTitle }>
                  <IoHelp />
                  <h2>
                    { t('helpTitle') }
                  </h2>
                </div>
                <p>
                  { t('helpText') }
                </p>
              </motion.div>
            </div>
          </motion.div> : null
        }
    </AnimatePresence>
  )
}

export default IncognitoWaitingDisplay
