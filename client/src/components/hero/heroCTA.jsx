import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import useTranslation from 'next-translate/useTranslation';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

import classes from './herpCTA.module.scss';

function HeroCTA() {
  const session = useSession();
  const router = useRouter();
  const { t } = useTranslation('auth');

  const ctaEventHandler = _ => {
    if( session.status === 'authenticated' ) router.push('/panel');
    if( session.status === 'unauthenticated' ) router.push('/auth');
  }

  return (
    <button 
      role='link'
      onClick={ ctaEventHandler }
      className={[ 
        classes.buttonPrimaryL,
        classes.ctaButton, 
        session.status === 'loading' ? classes.loading :
        session.status === 'authenticated' ? classes.toPanelCTA :
        classes.signUpCTA
      ].join(' ')}
    >
      <p className={ classes.singUp }>{t('prompt')}</p>
      <p className={ classes.toPanel }>{t('toPanel')}</p>
      <p className={ classes.loadingSpinner }><AiOutlineLoading3Quarters /></p>
    </button>
  )
}

export default HeroCTA
