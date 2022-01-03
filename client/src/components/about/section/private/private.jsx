import React from 'react';

import AboutBox from '../../aboutBox/aboutBox';

import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';

import { IoVolumeMute } from 'react-icons/io5';

import classes from './private.module.scss';
import SectionWrapper from '../sectionWrapper/sectionWrapper';

function Private() {
  const { t } = useTranslation('about');

  return (
    <SectionWrapper>
      <div className={ classes.sectionBody } id="private">
        <AboutBox>
          <h3 className={ classes.sectionTitle }>
            { t('private') }
          </h3>
          <div className={ classes.sectionIcon }> 
            <IoVolumeMute />
          </div>
        </AboutBox>
        <div className={ classes.sectionText }>
          <Trans 
            i18nKey='about:privateText'
            components={[ <a href="https://github.com/amir4rab/secureCall" key="link"  target="_blank" rel="noreferrer" /> ]}
          />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Private;
