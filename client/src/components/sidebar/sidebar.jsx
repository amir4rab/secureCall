import React from 'react'
import Contacts from '../contacts/contacts';
import classes from './sidebar.module.scss';
import useTranslation from 'next-translate/useTranslation'
import PopupButtons from './popupButtons';

function Sidebar({ setAddContactPopup, setShowRequestsPopup }) {
  const { t } = useTranslation('sidebar');
  return (
    <div className={ classes.sidebar }>
      <div className={ classes.header }>
        <h1>
          { t('title') }
        </h1>
      </div>
      <div className={ classes.contacts }>
        <PopupButtons 
          setAddContactPopup={ setAddContactPopup }
          setShowRequestsPopup={ setShowRequestsPopup }
        />
        <Contacts />
      </div>
      <div className={ classes.footer }>
        <button className={ classes.buttonBlockDark2 }>
          { t('settings') }
        </button>
        <button className={ classes.buttonBlockDark2 }>
          { t('about') }
        </button>
      </div>
    </div>
  )
}

export default Sidebar
