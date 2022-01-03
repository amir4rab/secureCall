import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import { AiOutlineLoading } from 'react-icons/ai'

import classes from './aboutCtaButton.module.scss';

const variants = {
  'visible': {
    opacity: 1
  },
  'hidden': {
    opacity: 0
  }
}

function AboutCtaButton() {
  const session = useSession();
  const router = useRouter();

  const buttonEvent = () => {
    if( session.status === 'loading' ) return;
    if( session.status === 'authenticated' ) router.push('/panel');
    if( session.status === 'unauthenticated' ) router.push('/auth');
  };

  return (
    <button onClick={ buttonEvent } className={ classes.ctaButton }>
      <AnimatePresence>
        {
          session.status === 'loading' ?
          <motion.div variants={ variants } exit='hidden' initial="hidden" animate="visible" className={ classes.loading }>
            <AiOutlineLoading  />
          </motion.div> :
          <motion.p variants={ variants } exit='hidden' initial="hidden" animate="visible" className={ classes.prompt }>
            {
              session.status === 'authenticated' ? 'to panel' : null
            }
            {
              session.status === 'unauthenticated' ? 'sign up' : null
            }
          </motion.p>
        }
      </AnimatePresence>
    </button>
  )
}

export default AboutCtaButton
