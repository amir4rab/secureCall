import React from 'react'

import classes from './featureSlider.module.scss';

const generateChild = (length) => {
  const output = [];

  for ( let i = 0 ; i < length ; i++ ) {
    output.push(i)
  }

  return output;
}

function FeatureIndicators({ length, selectEvent, activeIndex }) {
  return (
    <div className={ classes.indicators }>
      { 
        generateChild(length).map(index => (
          <button 
            key={index} 
            onClick={ _ => selectEvent(index) } 
            className={ index === activeIndex ? classes.activeDot : classes.dot }
          >
            {index}
          </button>
        ))}
    </div>
  )
}

export default FeatureIndicators
