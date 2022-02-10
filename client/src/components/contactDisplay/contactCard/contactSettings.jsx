import { useContext } from 'react'
import { SocketsContext } from '../../../providers/socketsProvider/socketsProvider';

import { IoPersonRemove, IoClose, IoTrash, IoInformationCircle, IoSettingsSharp } from 'react-icons/io5'

import classes from './contactSettings.module.scss';
import useTranslation from 'next-translate/useTranslation';

function ContactSettings({ state, setState, email, name }) {
  const { t } = useTranslation('contactCard');
  const { t: tCommon } = useTranslation('common');

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
              <p>{ tCommon('about') }</p>
            </h3>
            <div className={ classes.infoGroup }>
              <p>{t('name')}:</p>
              <p>{name}</p>
            </div>
            <div className={ classes.infoGroup }>
              <p>{t('emailAddress')}:</p>
              <p>{email}</p>
            </div>
          </div>
          <div className={ classes.settingsGroup }>
            <h3 className={ classes.title }>
              <IoSettingsSharp />
              <p>{ tCommon('settings') }</p>
            </h3>
            <div className={ classes.buttonWrapper }>
              <button onClick={ deleteEvent }>
                <IoTrash />
                <p>{ t('deleteContact') }</p>
              </button>
            </div>
            <div className={ classes.buttonWrapper }>
              <button onClick={ banEvent }>
                <IoPersonRemove />
                <p>{ t('deleteContact') }</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactSettings
