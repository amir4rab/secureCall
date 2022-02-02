import React from 'react';
import { motion } from 'framer-motion';
import BaseErrorComponent from './baseErrorComponent';
import useTranslation from 'next-translate/useTranslation'

import { IoCloudOffline } from 'react-icons/io5'

import { fadeUp, fadeLeft } from '../../animations/fade';

import classes from './error.module.scss';

function ServerErrorComponent() {
  const { t } = useTranslation('errorPage')

  return (
    <BaseErrorComponent errorCode={ '500' }>
        <motion.h1 variants={ fadeUp } animate='visible' initial='hidden' className={ classes.title }>
          <IoCloudOffline />
          <p>{ t('500Title') }</p>
        </motion.h1>
        <motion.h4 
          variants={ fadeLeft } 
          animate='visible' 
          initial='hidden' 
          className={ classes.subtitle }
        >
          { t('500Subtitle') }
        </motion.h4>
    </BaseErrorComponent>
  );
}

export default ServerErrorComponent;
