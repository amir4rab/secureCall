import React from 'react'
import classes from './contact.module.scss';

function Contact({ contact, onClick, customContact= false, children }) {

  if( customContact ) return (
    <div onClick={ onClick } className={ classes.contact }>
      { children }
    </div>
  )

  return (
    <div onClick={ onClick } className={ classes.contact }>
      <div className={ classes.imageWrapper }>
        <p className={ classes.imagePlaceHolder }>
          { contact.name.slice(0,1) }
        </p>
      </div>
      <div className={ classes.nameWrapper }>
        { contact.name }
      </div>
    </div>
  )
}

export default Contact
