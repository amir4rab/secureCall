import React from 'react';
import { motion } from 'framer-motion';
import BaseErrorComponent from './baseErrorComponent';
import useTranslation from 'next-translate/useTranslation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';


import { IoSad, IoHome, IoWarning, IoPerson, IoHelpBuoy, IoHourglass, IoBug } from 'react-icons/io5'

import { fadeUp, fadeLeft } from '../../animations/fade';
const fadeWithChildren = {
  visible: {
    opacity: 1,
    transition: {
      delayChildren: .075,
      staggerChildren: 0.15
    }
  },
  hidden: {
    opacity: 0
  }
}
const childrenAnimation = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: '-1rem' }
}
const authButtonVariants = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: '-1rem' },
  exit: { opacity: 0, y: '1rem' }
}
import classes from './error.module.scss';

function NotFoundComponent() {
  const { t } = useTranslation('errorPage');
  const session = useSession();
  const router = useRouter();

  const authEvents = () => {
    switch( session.status ) {
      case 'authenticated': {
        signOut();
        break;
      }
      case 'unauthenticated': {
        router.push('/auth');
        break;
      }
      default: {
        console.log('Session status is loading...')
      }
    }
  }

  const homeEvent = () => {
    router.push('/');
  }
  const helpEvent = () => {
    router.push('/help');
  }
  const reportBug = () => {
    router.push('/bugs');
  }

  return (
    <BaseErrorComponent errorCode={ '404' }>
        <motion.h1 variants={ fadeUp } animate='visible' initial='hidden' className={ classes.title }>
          <IoSad />
          <p>{ t('404Title') }</p>
        </motion.h1>
        <motion.h4 
          variants={ fadeLeft } 
          animate='visible' 
          initial='hidden' 
          className={ classes.subtitle }
        >
          { t('404Subtitle') }
        </motion.h4>
        <motion.div variants={ fadeWithChildren } animate='visible' initial='hidden' className={ classes.options }>
          <motion.button onClick={ homeEvent } variants={ childrenAnimation } className={ classes.option }>
            <IoHome />
            <p>{ t('home') }</p>
          </motion.button>
          <motion.button onClick={ helpEvent } variants={ childrenAnimation } className={ classes.option }>
            <IoHelpBuoy />
            <p>{ t('help') }</p>
          </motion.button>
          <motion.button onClick={ authEvents } variants={ childrenAnimation } className={ classes.option }>
            {
              session.status === 'loading' ?
              <motion.div className={ classes.authButton } variants={ authButtonVariants } animate='visible' initial='hidden' exit='exit'>
                <IoHourglass />
                <p>Loading</p>
              </motion.div> : null
            }
            {
              session.status === 'authenticated' ?
              <motion.div className={ classes.authButton } variants={ authButtonVariants } animate='visible' initial='hidden' exit='exit'>
                <IoWarning />
                <p>{ t('logout') }</p>
              </motion.div> : null
            }
            {
              session.status === 'unauthenticated' ?
              <motion.div className={ classes.authButton } variants={ authButtonVariants } animate='visible' initial='hidden' exit='exit'>
                <IoPerson />
                <p>{ t('signin') }</p>
              </motion.div> : null
            }
          </motion.button>
          <motion.button onClick={ reportBug } variants={ childrenAnimation } className={ classes.option }>
            <IoBug />
            <p>Report bugs</p>
          </motion.button>
        </motion.div>
    </BaseErrorComponent>
  );
}

export default NotFoundComponent;
