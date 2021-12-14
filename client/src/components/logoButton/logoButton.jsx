import React from 'react'
import classes from './logoButton.module.scss';


function LogoButton({ children, name, onClick, disabled }) {
  return (
    <button 
      className={ classes.logoButton } 
      onClick={ onClick } 
      disabled={ disabled }
    >
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
