// import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import classes from './popup.module.scss'
import { generateFade } from '../../../animations/fade';

import { IoCloseCircle } from 'react-icons/io5';

const fadeAnimation = generateFade({ 
  from:'up', 
  distance: '1rem',
  duration: '.3',
  delay:'.15' 
});

const outerLayerVariants = {
  visible: {
    opacity: 1
  },
  hidden: {
    opacity: 0
  }
};

const buttonVariants = {
  'visible': {
    opacity: 1,
    transition: {
      delay: .3
    }
  },
  'hidden': {
    opacity: 0
  }
}

function Popup({ displayState, setDisplayState, children }) {

  const close = e => {
    if( e.target.id === "outer" ) {
      setDisplayState(false)
    }
  }

  return (
    <AnimatePresence exitBeforeEnter>
        {
          displayState ? 
          <motion.div 
            id='outer' 
            className={ classes.popupWrapper } 
            onClick={ close }
            variants={ outerLayerVariants }
            animate='visible'
            initial='hidden'
            hidden='hidden'
            exit='hidden'
          >
            <motion.div
              variants={ fadeAnimation }
              animate='visible'
              initial='hidden'
              hidden='hidden'
              exit='hidden'
              className={ classes.popup }
            >
              <motion.button 
                variants={buttonVariants} 
                initial="hidden" 
                animate="visible" 
                className={ classes.closeBtn } 
                onClick={ _ => setDisplayState(false) }
              >
                <IoCloseCircle />
              </motion.button>
              { children }
            </motion.div>
          </motion.div> : null
        }
    </AnimatePresence>
  );
};

export default Popup;
