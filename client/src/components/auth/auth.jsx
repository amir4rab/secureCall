import { useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeDown, fadeUp } from '../../animations/fade';
import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';

import { IoLogoApple, IoLogoGoogle, IoLogoTwitter } from 'react-icons/io5';

import Box from '../box/box';
import tos from '../../utils/frontend/placeholder/tos';

import classes from './auth.module.scss';
import LogoButton from '../logoButton/logoButton';
import Checkbox from '../checkbox/checkbox';

const buttonsSectionVariants = {
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: .3
    }
  },
  exit: {
    x: -100,
    opacity: 0,
    transition: {
      duration: .3
    }
  },
  hidden: {
    x: 100,
    opacity: 0,
    transition: {
      duration: .3
    }
  }
};

function Auth() {
  const [ signInOptions, setSignInOptions ] = useState({
    callbackUrl: `http://localhost:3000/panel`
  })
  const [ isAgreed, setIsAgreed ] = useState(false);
  const { t } = useTranslation('auth');
  const { t: tCommon } = useTranslation('common');

  const router = useRouter();
  const session = useSession();

  useEffect( _ => {
    router.prefetch('/panel')
    if( router.locale !== 'en' ) {
      setSignInOptions({
        callbackUrl: `http://localhost:3000/${router.locale}/panel`
      })
    }
  }, [ router ]);

  return (
    <Box>
      <div className={ classes.auth }>
        <div className={ classes.column }>
          <motion.h2 
            className={ classes.main }
            variants={ fadeDown }
            initial='hidden'
            animate='visible'
          >
            { t('prompt') }
          </motion.h2>
          <motion.div
            className={ classes.tos }
            variants={ fadeDown }
            initial='hidden'
            animate='visible'
          >
            <h3>{t('tos')}:</h3>
            <div className={ classes.text }>{ tos() }</div>
          </motion.div>
          <motion.div
            className={ classes.tos }
            variants={ fadeDown }
            initial='hidden'
            animate='visible'
          >
            <Checkbox value={ isAgreed } setValue={ setIsAgreed }>
              <Trans 
                i18nKey='auth:aTos'
                components={[
                  <strong key="aTos"/>
                ]}
              />
            </Checkbox>
          </motion.div>
        </div>
        <div className={ classes.column }>
          <motion.h4 
            className={ classes.sec }
            variants={ fadeUp }
            initial='hidden'
            animate='visible'
          >
            { t('loginOptions') }
          </motion.h4>  
          <AnimatePresence exitBeforeEnter>
            {
              session.status === 'loading' ? 
              <motion.div 
                variants={buttonsSectionVariants}
                initial='hidden'
                animate='visible'
                exit='exit'
                className={ classes.buttonsSection }
              >
                <p>{tCommon('loading')}</p>
              </motion.div>
              : null
            }
            {
              session.status === 'unauthenticated' ? 
              <motion.div 
                variants={buttonsSectionVariants}
                initial='hidden'
                animate='visible'
                exit='exit'
                className={ classes.buttonsSection }
              >
                <LogoButton disabled={ !isAgreed } name={t('sW', { provider: 'Apple' })} onClick={ _ => console.log('clicked') }>
                  <IoLogoApple />
                </LogoButton>
                <LogoButton disabled={ !isAgreed } name={t('sW', { provider: 'Google' })} onClick={ _ => signIn('google', signInOptions) }>
                  <IoLogoGoogle />
                </LogoButton>
                <LogoButton disabled={ !isAgreed } name={t('sW', { provider: 'Twitter' })} onClick={ _ => console.log('clicked') }>
                  <IoLogoTwitter />
                </LogoButton>
              </motion.div>
              : null
            }
            {
              session.status === 'authenticated' ? 
              <motion.div 
                variants={buttonsSectionVariants}
                initial='hidden'
                animate='visible'
                exit='exit'
                className={ classes.buttonsSection }
              >
                <button className={ classes.buttonDarkL } onClick={ _ => router.push('/panel') }>
                  {t('toPanel')}
                </button>
                <button className={ classes.buttonRedL } onClick={ _ => signOut() }>
                  {t('singOut')}
                </button>
              </motion.div>
              : null
            }  
          </AnimatePresence>
        </div>
      </div>
    </Box>
  )
}

export default Auth
