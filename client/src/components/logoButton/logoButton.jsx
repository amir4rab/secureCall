import React from 'react'
import classes from './logoButton.module.scss';


function LogoButton({ children, name, onClick }) {
  return (
    <button className={ classes.logoButton } onClick={ onClick }>
      <div className={ classes.imageWrapper }>
        { children }
      </div>
      <div className={ classes.name }>
        { name }
      </div>
    </button>
  )
}

export default LogoButton
