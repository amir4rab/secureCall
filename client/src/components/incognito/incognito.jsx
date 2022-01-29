import { useRef } from 'react'
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

import { validateId, validateSecret } from '../../utils/frontend/validators/validators';

import classes from './incognito.module.scss';
import SingupPrompt from './singupPrompt/singupPrompt';
import DefaultMobileMenu from '../mobileMenu/defaultMobileMenu';

import useTranslation from 'next-translate/useTranslation';

import { IoWarning } from 'react-icons/io5';

import { fadeUp, fadeRight } from '../../animations/fade';

const fadeWithChild = {
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.15
    }
  },
  hidden: {
    opacity: 0
  }
}

const childVariants = { 
  visible: {
    opacity: 1,
    x: '0rem'
  },
  hidden: {
    opacity: 0,
    x: '-0.5rem'
  }
}

function Incognito() {
  const router = useRouter();
  const userIdRef = useRef('');
  const userSecretRef = useRef('');
  const userIdErrorRef = useRef('');
  const userSecretErrorRef = useRef('');

  const { t } = useTranslation('incognito');
  const { t: commenT } = useTranslation('common');

  const callEvent = () => {
    if ( !validateId(userIdRef.current.value) ) {
      console.log('here')
      userIdErrorRef.current.value = 'Id is invalid!';
      return;
    } else {
      userIdErrorRef.current.value = '';
    }
    if ( !validateSecret(userSecretRef.current.value) ) {
      userSecretErrorRef.current.value = 'Secret is invalid';
      return;
    }  {
      userSecretErrorRef.current.value = '';
    }

    router.push(`/incognito/call?calling=true#id=${userIdRef.current.value}&secret=${userSecretRef.current.value}`);
  };

  const answerEvent = () => {
    router.push(`/incognito/call?calling=false`);
  }

  return (
    <>
      <DefaultMobileMenu />
      <div className={ classes.incognito }>
        <div className={ classes.column }>
          <motion.h1 variants={ fadeUp } animate='visible' initial='hidden' className={ classes.title }>
            {t('title')}
          </motion.h1>
          <motion.div variants={ fadeRight } animate='visible' initial='hidden'  className={ classes.description }>
            {t('subtitle')}
          </motion.div>
          <motion.div variants={ fadeRight } animate='visible' initial='hidden'  className={ classes.warning }>
            <IoWarning />
            <p>
              {t('warning')}
            </p>
          </motion.div>
          <motion.div variants={ fadeWithChild } animate='visible' initial='hidden' className={ classes.box }>
            <motion.h3 variants={ childVariants } className={ classes.boxTitle }>
              Call someone 
            </motion.h3>
            <motion.div variants={ childVariants } className={ classes.inputGroup }>
              <div className={ classes.labelArea }>
                <label htmlFor="peerId">{t('remoteId')}</label>
                <input 
                  type='text' 
                  className={ classes.error }
                  ref={ userIdErrorRef } 
                  readOnly 
                />
              </div>
              <input autoComplete='off' ref={ userIdRef } placeholder={t('remoteIdPlaceholder')} id='peerId' type='text' />
            </motion.div>
            <motion.div variants={ childVariants } className={ classes.inputGroup }>
              <div className={ classes.labelArea }>
                <label htmlFor='peerSecret'>{t('remoteSecret')}</label>
                <input 
                  type='text'
                  className={ classes.error } 
                  ref={ userSecretErrorRef } 
                  readOnly 
                />
              </div>
              <input autoComplete='off' ref={ userSecretRef } placeholder={t('remoteSecretPlaceholder')} id='peerSecret' type="text" />
            </motion.div>
            <motion.button variants={ childVariants } onClick={ callEvent } className={ classes.buttonPrimary }>
            { commenT('call') }
            </motion.button>
          </motion.div>
          <motion.div variants={ fadeWithChild } animate='visible' initial='hidden' className={ classes.box }>
            <motion.h3 variants={ childVariants } className={ classes.boxTitle }>
              {t('getCall')}
            </motion.h3>
            <motion.div variants={ childVariants } className={ classes.boxInfo }>
              {t('getCallPrompt')}
            </motion.div>
            <motion.button onClick={ answerEvent } variants={ childVariants } className={ classes.buttonPrimary }>
              { commenT('receiveCall') }
            </motion.button>
          </motion.div>
        </div>
        <div className={ classes.column }>
          <SingupPrompt />
        </div>
      </div>
    </>
  )
}

export default Incognito
