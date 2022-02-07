import React from 'react'
import classes from './aboutSection.module.scss';
import { IoChevronBack, IoShield } from 'react-icons/io5';
import useTranslation from 'next-translate/useTranslation';

import E2ee from '../../about/section/e2ee/e2ee';
import OpenSource from '../../about/section/openSource/openSource';
import Private from '../../about/section/private/private';


function AboutSection({ close }) {
  const { t } = useTranslation('settings');

  return (
    <div className={ classes.aboutSection }>
      <div className={ classes.titleBox }>
        <button onClick={ close } className={ classes.backButton }><IoChevronBack /></button>
        <h3 className={ classes.title }>{t('about')}</h3>
      </div>
      <div className={ classes.aboutText }>
        <OpenSource />
        <E2ee />
        <Private />
      </div>
    </div>
  );
};

export default AboutSection;
