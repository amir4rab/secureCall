import { useState } from 'react';
import { useRouter } from 'next/router';

import { motion, AnimatePresence } from 'framer-motion'
import useTranslation from 'next-translate/useTranslation';

import Box from '../box/box';
import { IoSettings, IoInformation, IoChevronBack, IoArrowBack, IoHelpBuoy, IoLogoGithub, IoCodeSlash, IoPerson, IoLink } from 'react-icons/io5';

import AccountSection from './accountSection/accountSection';
import SettingsSection from './settingsSection/settingsSection';
import AboutSection from './aboutSection/aboutSection';
import HelpSection from './helpSection/helpSection';

import classes from './settings.module.scss';

const motionWrapperVariants = {
  visible: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  }
}

const MotionWrapper = ({ children }) => {
  return (
    <motion.div variants={motionWrapperVariants} animate="visible" initial="hidden" exit="hidden">
      { children }
    </motion.div>
  )
}

function Settings({ data }) {
  const router = useRouter();
  const [ selectedItem, setSelectedItem ] = useState(null);
  const { t } = useTranslation('settings');

  const closeItem = () => {
    setSelectedItem(null);
  }

  return (
    <Box>
      <div className={ classes.inner }>
        <div className={[ classes.leftColumn, selectedItem !== null ? classes.hidden : null ].join(' ')}>
          <div className={ classes.titleArea }>
            <button onClick={ _ => router.push('/panel') } className={ classes.mobileBackButton }>
              <IoChevronBack />
            </button>
            <h1 className={ classes.title }>
              {t('settings')}
            </h1>
          </div>
          <div className={ classes.buttons }>
            <button onClick={ _ => router.push('/panel') } className={ classes.desktopBackButton }>
              <div className={ classes.svgWrapper }>
                <IoArrowBack />
              </div>
              <p>{t("bToPanel")}</p>
            </button>
            <button onClick={ _ => setSelectedItem('settings') } className={[ classes.button, selectedItem === 'settings' ? classes.active : null ].join(' ')}>
              <div className={ classes.svgWrapper }>
                <IoSettings />
              </div>
              <p>{t('settings')}</p>
            </button>
            <button onClick={ _ => setSelectedItem('account') } className={[ classes.button, selectedItem === 'account' ? classes.active : null ].join(' ')}>
              <div className={ classes.svgWrapper }>
                <IoPerson />
              </div>
              <p>{t('account')}</p>
            </button>
            <button onClick={ _ => setSelectedItem('about') } className={[ classes.button, selectedItem === 'about' ? classes.active : null ].join(' ')}>
              <div className={ classes.svgWrapper }>
                <IoInformation />
              </div>
              <p>{t("about")}</p>
            </button>
            <button onClick={ _ => setSelectedItem('help') } className={[ classes.button, selectedItem === 'help' ? classes.active : null ].join(' ')}>
              <div className={ classes.svgWrapper }>
                <IoHelpBuoy />
              </div>
              <p>{t("help")}</p>
            </button>
            <a href="https://github.com/amir4rab/secureCall" target="_blank" rel="noreferrer" className={ classes.button }>
              <div className={ classes.svgWrapper }>
                <IoLogoGithub />
              </div>
              <p>{t("sourceCode")}</p>
              <IoLink className={ classes.link }/>
            </a>
            <a href="https://amir4rab.com" target="_blank" rel="noreferrer" className={ classes.button }>
              <div className={ classes.svgWrapper }>
                <IoCodeSlash />
              </div>
              <p>{t("developer")}</p>
              <IoLink className={ classes.link }/>
            </a>
          </div>
        </div>
        <div className={[ classes.rightColumn, selectedItem === null ? classes.hidden : null ].join(' ') }>
          <AnimatePresence exitBeforeEnter>
            {/* {
              selectedItem === null ? <p>Please select a item</p> : null
            } */}
            {
              selectedItem === 'settings' ? <MotionWrapper><SettingsSection close={ closeItem } /></MotionWrapper> : null
            }
            {
              selectedItem === 'about' ? <MotionWrapper><AboutSection close={ closeItem } /></MotionWrapper> : null
            }
            {
              selectedItem === 'help' ? <MotionWrapper><HelpSection data={ data.helpData } close={ closeItem } /></MotionWrapper> : null
            }
            {
              selectedItem === 'account' ? <MotionWrapper><AccountSection close={ closeItem } /></MotionWrapper> : null 
            }
          </AnimatePresence>
        </div>
      </div>
    </Box>
  )
}

export default Settings
