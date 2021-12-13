import { motion } from 'framer-motion';
import classes from './popup.module.scss';


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
              { children }
            </motion.div>
          </div> 
          : null
        }
    </>
  );
};

export default Popup;
