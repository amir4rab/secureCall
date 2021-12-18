import { useContext } from 'react'
import { SocketsContext } from '../../../providers/socketsProvider/socketsProvider';

import { IoPersonRemove, IoClose } from 'react-icons/io5'

import classes from './contactSettings.module.scss';

function ContactSettings({ state, setState, email }) {
  const { deleteContact } = useContext(SocketsContext);

  const deleteEvent = () => {
    deleteContact(email)
  }

  return (
    <div className={[ classes.contactSettings, state ? classes.open : classes.close ].join(' ')}>
      <div className={ classes.inner }>
        <button onClick={ _ => setState(false) } className={ classes.close }>
          <IoClose />
        </button>
        <h3 className={ classes.title }>
          Settings
        </h3>
        <div className={ classes.settingsGroup }>
          <label>
            Remove contact
          </label>
          <div className={ classes.buttonWrapper }>
            <button onClick={ deleteEvent }>
              <IoPersonRemove />
              <p>Delete</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactSettings
