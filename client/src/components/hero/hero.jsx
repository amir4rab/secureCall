import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

import Link from 'next/link';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import { IoLogoGithub, IoLockClosed, IoFlash, IoLaptop } from 'react-icons/io5';
import LangSelector from '../selectors/langSelector/langSelector';

import { fadeLeft, fadeRight, fadeDown, fadeUp } from '../../animations/fade';

import classes from './hero.module.scss';
import Box from '../box/box';

const featuresVariants = {
  hidden: { 
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: .3
    }
  }
}

const featureVariants = {
  hidden: { 
    opacity: 0,
    x: '-0.5rem'
  },
  visible: { 
    opacity: 1,
    x: '0rem'
  }
}

const Feature = ({ children }) => {
  return (
    <motion.div
      className={ classes.feature }
      variants={ featureVariants }
    >
      { children }
    </motion.div>
  )
}

function Hero() {
  const { t } = useTranslation('common');
  const { t: heroT } = useTranslation('hero');
  const { t: authT } = useTranslation('auth');
  const router = useRouter();

  return (
    <Box>
      <div className={ classes.hero }>
        <div className={ classes.columnsWrapper }>
          <div className={ classes.column }>
            <motion.h1 //** Title **//
              className={ classes.title }
              variants={ fadeUp }
              initial='hidden'
              animate='visible'
            >
              {t('websiteName')}
            </motion.h1>
            <motion.h4 //** Website description **//
              className={ classes.info }
              variants={ fadeLeft }
              initial='hidden'
              animate='visible'
            >
              {t('websiteDescription')}
            </motion.h4>
            <motion.div //** Features **//
              variants={ featuresVariants }
              initial='hidden'
              animate='visible'
              className={ classes.features }
            >
              <Feature>
                <IoLogoGithub/> <p>{ heroT('openSource') }</p>
              </Feature>
              <Feature>
                <IoLockClosed/> <p>{ heroT('eTEE') }</p>
              </Feature>
              <Feature>
                <IoFlash/> <p>{ heroT('fast') }</p>
              </Feature>
              <Feature>
                <IoLaptop/> <p>{ heroT('mPlatform') }</p>
              </Feature>
            </motion.div>
            <motion.div
              className={ classes.buttonsSection }
              variants={ fadeLeft }
              initial='hidden'
              animate='visible'
            >
              <button className={ classes.buttonPrimaryL } role='link' onClick={ _ => router.push('/auth') }>
                { authT('prompt') }
              </button>
            </motion.div>
          </div>
          <div className={ classes.column }>
            <motion.div
              className={ classes.imagesWrapper }
              variants={ fadeRight }
              initial='hidden'
              animate='visible'
            >
              <img className={ classes.image } src={require('../../../public/assets/hero_img_0.png').default.src} alt={'hero_img_0'} />
              <img className={ classes.image } src={require('../../../public/assets/hero_img_1.png').default.src} alt={'hero_img_1'} />
            </motion.div>
          </div>
        </div>
        <motion.div //** footer **//
          variants={ fadeDown }
          initial='hidden'
          animate='visible'
          className={ classes.footer }
        > 
          <div className={ classes.subText }>
            <p>
              <Trans
                i18nKey='hero:readMore'
                components={[
                  <Link href='/about' />
                ]}
                values={{ name: 'Secure Call' }}
              />
            </p>
          </div>
          <LangSelector horizontal/>
        </motion.div>
      </div>
    </Box>
  )
}

export default Hero
