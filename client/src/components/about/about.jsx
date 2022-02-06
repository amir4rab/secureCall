import Link from 'next/link';
import React from 'react';

import classes from './about.module.scss';

import { motion } from 'framer-motion';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';

import AboutCtaButton from './aboutCtaButton/aboutCtaButton';
import LangSelector from '../selectors/langSelector/langSelector';

import OpenSource from './section/openSource/openSource';
import E2ee from './section/e2ee/e2ee';
import Private from './section/private/private';
import DefaultMobileMenu from '../mobileMenu/defaultMobileMenu';;

import { fadeUp, fadeDown, fadeRight } from '../../animations/fade';
const fade = {
  visible: {
    opacity: 1
  },
  hidden: {
    opacity: 0
  }
}

function About() {
  const { t: commonT } = useTranslation('common');

  return (
    <div className={ classes.about }>
      <motion.nav variants={ fade } animate="visible" initial="hidden" className={ classes.navbar }>
        <div className={ classes.navChild }>
          <Link href='/'>
            Back to home
          </Link>
        </div>
        <div className={ classes.navChild }>
          <LangSelector />
        </div>
        <div className={ classes.navChild }>
          <AboutCtaButton />
        </div>

      </motion.nav>
      <div className={ classes.infoBox }>
        <motion.h1 variants={ fadeUp } animate="visible" initial="hidden" className={ classes.title }>
          { commonT('about') }
        </motion.h1>
        <motion.div variants={ fadeDown } animate="visible" initial="hidden"  className={ classes.subtitle }>
          <h3>
            <Trans 
              i18nKey='about:aboutText'
              components={[
                <Link key="0" href={'/about#open-source'} />,
                <Link key="1" href={'/about#private'} />,
                <Link key="2" href={'/about#end-to-end-encrypted'} />
              ]}
            />
          </h3>
        </motion.div>
        <div className={ classes.mobileLangSelector }>
          <LangSelector horizontal={ true } />
        </div>
      </div>
      <motion.div variants={ fadeRight } animate="visible" initial="hidden"  className={ classes.contents }>
        <OpenSource/>
        <E2ee />
        <Private />
      </motion.div>
      <DefaultMobileMenu />
    </div>
  )
}

export default About
