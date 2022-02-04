import { motion } from 'framer-motion';

import useTranslation from 'next-translate/useTranslation';

import LangSelector from '../../selectors/langSelector/langSelector';
import { IoChevronBack, IoLanguage, IoContrast } from 'react-icons/io5';
import { MotionWrapper, parentVariants } from '../settingsAnimations';

import classes from './settingsSection.module.scss';


function SettingsSection({ close }) {
  const { t } = useTranslation('settings')

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
