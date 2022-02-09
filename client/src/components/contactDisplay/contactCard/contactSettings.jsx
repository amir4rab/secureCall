import { useContext } from 'react'
import { SocketsContext } from '../../../providers/socketsProvider/socketsProvider';

import { IoPersonRemove, IoClose, IoTrash, IoInformationCircle, IoSettingsSharp } from 'react-icons/io5'

import classes from './contactSettings.module.scss';

function ContactSettings({ state, setState, email, name }) {
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
        <div className={ classes.content }>
          <div className={ classes.settingsGroup }>
            <h3 className={ classes.title }>
              <IoInformationCircle />
              <p>About</p>
            </h3>
            <div className={ classes.infoGroup }>
              <p>Name:</p>
              <p>{name}</p>
            </div>
            <div className={ classes.infoGroup }>
              <p>Email Address:</p>
              <p>{email}</p>
            </div>
          </div>
          <div className={ classes.settingsGroup }>
            <h3 className={ classes.title }>
              <IoSettingsSharp />
              <p>Settings</p>
            </h3>
            <div className={ classes.buttonWrapper }>
              <button onClick={ deleteEvent }>
                <IoTrash />
                <p>Delete Contact</p>
              </button>
            </div>
            <div className={ classes.buttonWrapper }>
              <button onClick={ banEvent }>
                <IoPersonRemove />
                <p>Ban Contact</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactSettings
