import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { IoGlasses } from 'react-icons/io5'
import classes from './goIncognito.module.scss';

function GoIncognito() {
  const { t } = useTranslation('common');
  return (
    <div className={ classes.incognitoContact }>
      <div className={ classes.svgWrapper }>
        <IoGlasses />
      </div>
      <p>{t('goIncognito')}</p>
    </div>
  );
}

export default GoIncognito;
