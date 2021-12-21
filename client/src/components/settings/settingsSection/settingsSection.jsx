import React from 'react';
import { motion } from 'framer-motion';

import { signOut } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';

import LangSelector from '../../selectors/langSelector/langSelector';
import { IoChevronBack, IoLanguage, IoContrast, IoPerson } from 'react-icons/io5';

import classes from './settingsSection.module.scss';

const parentVariants = {
  hidden: { opacity: 0, },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

const MotionWrapper = ({ children, className }) => (
  <motion.div className={ className } variants={{ 'visible': { opacity: 1, y: '0' }, 'hidden': { opacity: 0, y: '-1rem' } }}>{children}</motion.div>
);

function SettingsSection({ close }) {
  const { t } = useTranslation('settings')
  const singOutEvent = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <motion.div variants={ parentVariants } initial='hidden' animate='visible' className={ classes.settingsSection }>
      <div className={ classes.titleBox }>
        <button onClick={ close } className={ classes.backButton }><IoChevronBack /></button>
        <h3 className={ classes.title }>
          {t('settings')}
        </h3>
      </div>
      <div className={ classes.items }>
        <MotionWrapper className={ classes.groupItem }>
          <h4 className={ classes.groupTitle }>
            <div className={ classes.svgWrapper }><IoLanguage /></div>
            <p>{t("language")}</p>
          </h4>
          <LangSelector />
        </MotionWrapper>
        <MotionWrapper className={[ classes.groupItem, classes.alignLeft ].join(' ')}>
          <h4 className={ classes.groupTitle }>
            <div className={ classes.svgWrapper }><IoPerson /></div>
            <p>{t("account")}</p>
          </h4>
          <button onClick={ singOutEvent } className={ classes.logoutBtn }>
            {t("logout")}
          </button>
        </MotionWrapper>
        <MotionWrapper className={ classes.groupItem }>
          <h4 className={ classes.groupTitle }>
            <div className={ classes.svgWrapper }><IoContrast /></div>
            <p>{t("theme")}</p>
          </h4>
        </MotionWrapper>
      </div>
    </motion.div>
  )
}

export default SettingsSection
