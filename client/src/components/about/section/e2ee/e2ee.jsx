import React from 'react';

import AboutBox from '../../aboutBox/aboutBox';

import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';

import { IoShield } from 'react-icons/io5';

import classes from './e2ee.module.scss';
import SectionWrapper from '../sectionWrapper/sectionWrapper';

function E2ee() {
  const { t } = useTranslation('about');

  return (
    <SectionWrapper>
      <div className={ classes.sectionBody } id="end-to-end-encrypted">
        <AboutBox>
          <h3 className={ classes.sectionTitle }>
            { t('e2ee') }
          </h3>
          <div className={ classes.sectionIcon }> 
            <IoShield />
          </div>
        </AboutBox>
        <div className={ classes.sectionText }>
          <Trans 
            i18nKey='about:e2eeText'
            components={[ <a href="https://github.com/amir4rab/secureCall" key="link"  target="_blank" rel="noreferrer" /> ]}
          />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default E2ee;
