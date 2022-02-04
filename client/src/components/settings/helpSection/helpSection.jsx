import { motion } from 'framer-motion';

import classes from './helpSection.module.scss';

import { IoChevronBack } from 'react-icons/io5';
import useTranslation from 'next-translate/useTranslation';

import { MotionWrapper, parentVariants } from '../settingsAnimations';

function HelpSection({ close, data }) {
  const { t } = useTranslation('settings');
  return (
    <motion.div variants={ parentVariants } animate='visible' initial='hidden' className={ classes.helpSection }>
      <div className={ classes.titleBox }>
        <button onClick={ close } className={ classes.backButton }><IoChevronBack /></button>
        <h3 className={ classes.title }>{t('help')}</h3>
      </div>
      <main className={ classes.markdownChildren }>
        {
          data.map(item => <MotionWrapper style={{ paddingBottom: '2.5rem' }} key={ item.name }><article dangerouslySetInnerHTML={{ __html: item.html }} /></MotionWrapper>)
        }
      </main>
    </motion.div>
  );
};

export default HelpSection;
