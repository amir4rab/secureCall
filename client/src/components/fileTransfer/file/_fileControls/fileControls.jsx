import React from 'react'
import { IoMusicalNotes, IoDocument, IoImage, IoFilm, IoPause, IoSend, IoClose, IoDownload, IoSave } from 'react-icons/io5';

import classes from './fileControls.module.scss';

function FileControls({ state, receiving = false, removeFn, sendFn, cancelFn, saveFn }) {
  switch(state) {
    case 'waiting': return (
      <div className={ classes.actionWrapper }>
        <button onClick={ removeFn } className={ classes.deleteButton }>
          <IoClose />
        </button>
        <button onClick={ sendFn } className={ classes.sendButton }>
          { !receiving ? <IoSend /> : <IoSave /> }
        </button>
      </div>
    )
    case 'requested': return (
      <div className={ classes.actionWrapper }>
      </div>
    )
    case 'sending': return (
      <div className={ classes.actionWrapper }>
        <button onClick={ cancelFn } className={ classes.cancelButton }>
          <IoPause />
        </button>
      </div>
    )
    case 'receiving': return (
      <div className={ classes.actionWrapper }>
        <button onClick={ cancelFn } className={ classes.cancelButton }>
          <IoPause />
        </button>
      </div>
    )
    case 'sended': return (
      <div className={ classes.actionWrapper }>
      </div>
    )
    case 'received': return (
      <div className={ classes.actionWrapper }>
        <button onClick={ saveFn } className={ classes.saveButton }>
          <IoDownload />
        </button>
      </div>
    )
    case 'downloaded': return (
      <div className={ classes.actionWrapper }>
        <button disabled onClick={ saveFn } className={ classes.saveButton }>
          <IoDownload />
        </button>
      </div>
    )
    case 'saved': return (
      <div className={ classes.actionWrapper }>
      </div>
    )
    default : return (
      <div className={ classes.actionWrapper }>
      </div>
    )
  };
}

export default FileControls