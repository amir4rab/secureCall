import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import classes from './selector.module.scss';

const optionsVariantsVirtical = {
  'visible': {
    y: '.5rem',
    opacity: 1
  },
  'hidden': {
    y: 0,
    opacity: 0
  }
}

const optionsVariantsHorizontal = {
  'visible': {
    x: '.5rem',
    opacity: 1
  },
  'hidden': {
    x: 0,
    opacity: 0
  }
}


function Selector({ options, event, defaultActiveOption= null, large= false, horizontal, width= '2.5rem' }) {
  const [ optionsState, setOptionsState ] = useState(false);
  const [ selectedOption, setSelectedOption ] = useState( defaultActiveOption === null ? options[0] : defaultActiveOption );
  const onBlurCallback = useRef(null);

  const selectEventHandler = (value) => {
    event(value); 
    setOptionsState(false);
    setSelectedOption(value);
  }

  const focusEventHandler = _ => {
    onBlurCallback.current && clearTimeout(onBlurCallback.current);
    setOptionsState(true);
  }

  const blurEventHandler = _ => {
    onBlurCallback.current = setTimeout(() => {
      setOptionsState(false);
    }, 350);
  }

  const onHover = _ => {
    onBlurCallback.current && clearTimeout(onBlurCallback.current);
    setOptionsState(true);
  }

  useEffect(_ => {
    return () => {
      onBlurCallback.current && clearTimeout(onBlurCallback.current);
    }
  }, []);

  return (
    <>   
      <div
        onMouseLeave={ blurEventHandler }
        className={[ classes.selector, horizontal ? classes.horizontal : null ].join(' ')}
        onMouseEnter={ onHover }
        onBlur={ blurEventHandler }
      >
        <button
          onClick={ focusEventHandler }
          className={ classes.activeOption }
          style={{
            minWidth: width,
            maxWidth: width,
            fontSize: large ? '1rem' : '.8rem'
          }}
        >
          { selectedOption }
        </button>
        <AnimatePresence exitBeforeEnter>
          {
            optionsState ?
            <motion.div
              variants={ horizontal ? optionsVariantsHorizontal : optionsVariantsVirtical }
              animate='visible'
              initial='hidden'
              exit='hidden'
              className={ classes.options }
              style={{
                marginLeft: horizontal ? width : 0,
                fontSize: large ? '1rem' : '.8rem'
              }}
            >
              {
                options.map(item => {
                  if( item !== selectedOption ) return (
                    <button 
                      onClick={ _ => selectEventHandler(item) } 
                      className={ classes.option } 
                      key={ item }
                      style={{
                        minWidth: width,
                        maxWidth: width,
                        fontSize: large ? '1rem' : '.8rem'
                      }}
                    >
                      { item }
                    </button>
                  )
                })
              }
            </motion.div> : null
          }
        </AnimatePresence>
      </div>
    </>
  );
};

export default Selector;
