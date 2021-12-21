import React from 'react'
import classes from './aboutSection.module.scss';
import { IoChevronBack, IoShield } from 'react-icons/io5';
import useTranslation from 'next-translate/useTranslation';


function AboutSection({ close }) {
  const { t } = useTranslation('settings');

  return (
    <div className={ classes.aboutSection }>
      <div className={ classes.titleBox }>
        <button onClick={ close } className={ classes.backButton }><IoChevronBack /></button>
        <h3 className={ classes.title }>{t('about')}</h3>
      </div>
      <div className={ classes.aboutText }>
        <p>
          Securecall is a e2ee (end to end encrypted), open-source video and audio calling application, available for free.
        </p>
      </div>
      <div className={ classes.aboutText }>
        <h5 className={ classes.title }>
          <IoShield/>
          <p>Encryption in calls</p>
        </h5>
        <p>
          Video calls and audio calls are e2ee, encryption method is provided by WebRTC.
        </p>
      </div>
    </div>
  );
};

export default AboutSection;
