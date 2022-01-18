import React from 'react'

import classes from './featureSlider.module.scss';

function FeatureItem({ icon, title, text, activeIndex, index, calcPosition }) {
  return (
    <div className={ classes.sliderWrapper }>
      <div className={ classes.feature } >
        <div className={ classes.featureTitle }> 
          { icon }
          <h4>
            { title }
          </h4>
        </div>
        <p className={ classes.featureBody }> 
          { text }
        </p>
      </div>
    </div>
  )
}

export default FeatureItem
