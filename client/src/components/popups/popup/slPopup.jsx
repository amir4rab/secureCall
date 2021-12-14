import { motion } from 'framer-motion';
import classes from './popup.module.scss';

import { IoCloseCircle } from 'react-icons/io5';

const buttonVariants = {
  'visible': {
    opacity: 1,
    transition: {
      delay: .5
    }
  },
  'hidden': {
    opacity: 0
  }
}


function Popup({ displayState, setDisplayState, children, layoutId }) {

  const close = e => {
    if( e.target.id === "outer" ) {
      setDisplayState(false)
    }
  }

  return (
    <>
        {
          displayState ? 
          <div 
            id='outer'
            className={ classes.popupWrapper } 
            onClick={ close }
          >
            <motion.div
              layoutId={ `${layoutId}-body` }
              className={ classes.popup }
              layout
            >
              <motion.button variants={buttonVariants} initial="hidden" animate="visible" className={ classes.closeBtn } onClick={ _ => setDisplayState(false) }>
                <IoCloseCircle />
              </motion.button>
              { children }
            </motion.div>
          </div> 
          : null
        }
    </>
  );
};

export default Popup;
