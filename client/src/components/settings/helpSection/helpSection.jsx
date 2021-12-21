import React from 'react'

import classes from './helpSection.module.scss';

import { IoChevronBack } from 'react-icons/io5';
import useTranslation from 'next-translate/useTranslation';


function HelpSection({ close }) {
  const { t } = useTranslation('settings');

  return (
    <div className={ classes.helpSection }>
      <div className={ classes.titleBox }>
        <button onClick={ close } className={ classes.backButton }><IoChevronBack /></button>
        <h3 className={ classes.title }>{t('help')}</h3>
      </div>
    </div>
  );
};

export default HelpSection;
