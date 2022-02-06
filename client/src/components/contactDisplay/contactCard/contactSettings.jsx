import { useContext } from 'react'
import { SocketsContext } from '../../../providers/socketsProvider/socketsProvider';

import { IoPersonRemove, IoClose, IoTrash } from 'react-icons/io5'

import classes from './contactSettings.module.scss';

function ContactSettings({ state, setState, email }) {
  const { deleteContact, banUser } = useContext(SocketsContext);

  const deleteEvent = () => {
    deleteContact(email)
  }

  const banEvent = async _ => {
    banUser(email);
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
              <IoTrash />
              <p>Delete Contact</p>
            </button>
          </div>
        </div>
        <div className={ classes.settingsGroup }>
          <label>
            Ban contact
          </label>
          <div className={ classes.buttonWrapper }>
            <button onClick={ banEvent }>
              <IoPersonRemove />
              <p>Ban Contact</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactSettings
