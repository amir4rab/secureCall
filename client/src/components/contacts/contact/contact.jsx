import React from 'react'
import classes from './contact.module.scss';

function Contact({ contact, onClick }) {
  return (
    <div onClick={ onClick } className={ classes.contact }>
      <div className={ classes.imageWrapper }>
        {
          // contact.image !== null ? 
          // <img className={ classes.image } src={ contact.image } alt={ `profile image of ${contact.name}` } />
          // :
          <p className={ classes.imagePlaceHolder }>
            { contact.name.slice(0,1) }
          </p>
        }
      </div>
      <div className={ classes.nameWrapper }>
        { contact.name }
      </div>
    </div>
  )
}

export default Contact
