import React from 'react';

import AboutBox from '../../aboutBox/aboutBox';

import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';

import { IoLogoGithub } from 'react-icons/io5';

import classes from './openSource.module.scss';
import SectionWrapper from '../sectionWrapper/sectionWrapper';

function OpenSource() {
  const { t } = useTranslation('about');

  return (
    <SectionWrapper>
      <div className={ classes.sectionBody } id="open-source">
        <AboutBox>
          <h3 className={ classes.sectionTitle }>
            { t('open-source') }
          </h3>
          <div className={ classes.sectionIcon }> 
            <IoLogoGithub />
          </div>
        </AboutBox>
        <div className={ classes.sectionText }>
          <Trans 
            i18nKey='about:open-source-text'
            components={[ <a href="https://github.com/amir4rab/secureCall" key="link"  target="_blank" rel="noreferrer" /> ]}
          />
        </div>
      </div>
    </SectionWrapper>
  )
}

export default OpenSource
