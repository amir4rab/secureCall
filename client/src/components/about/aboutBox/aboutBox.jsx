import React from 'react';
import classes from './aboutBox.module.scss';

function AboutBox({ children }) {
  return (
    <div className={ classes.aboutBox }>
      <div className={ classes.inner }>
        { children }
      </div>
    </div>
  )
}

export default AboutBox
