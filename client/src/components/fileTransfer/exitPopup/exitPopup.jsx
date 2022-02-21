import React from 'react'
import Popup from '../../popups/popup/popup';

import { IoWarning } from 'react-icons/io5';

import classes from './exitPopup.module.scss';

function ExitPopup({ displayState, setDisplayState, exitFunction }) {
  return (
    <Popup displayState={ displayState } setDisplayState={ setDisplayState }>
      <div className={ classes.inner }>
        <div className={ classes.prompt }>
          Are you sure you want to end the data connection?
        </div>
        <button onClick={ exitFunction } className={ classes.alert }>
          <IoWarning />
          <p>Yes</p>
        </button>
      </div>
    </Popup>
  )
}

export default ExitPopup