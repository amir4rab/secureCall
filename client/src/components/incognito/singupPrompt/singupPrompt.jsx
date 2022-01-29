import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router'
import Link from 'next/link';

import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react'

import classes from './singupPrompt.module.scss';
import FeaturesSlider from '../../featuresSlider/featuresSlider';

const DynamicDeviceDetector = dynamic( _ => import('./deviceDetector.jsx'), { ssr: false }); 

const variants = {
  visible: {
    opacity: 1,
    x: 0
  },
  hidden: {
    opacity: 0,
    x: '1rem'
  }
}

function SingupPrompt() {
  const [ isMobile, setIsMobile ] = useState(true);
  const session = useSession();
  const router = useRouter();

  useEffect( _ => {
    if ( isMobile !== false ) return;
    console.log(session.status)
  }, [ isMobile, session ]);

  return (
    <div className={ classes.singupPrompt }>
      <div className={ classes.background } />
      <div className={ classes.contentWrapper }>
        <div className={ classes.content }>
          <DynamicDeviceDetector setData={ setIsMobile } />
          <AnimatePresence>
            {
              session.status !== 'loading' ? 
              <motion.div variants={ variants } animate='visible' initial='hidden' className={ classes.prompt }>
                <FeaturesSlider authState={ session.status } animate={ !isMobile } />
              </motion.div> : null
            }
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default SingupPrompt;
