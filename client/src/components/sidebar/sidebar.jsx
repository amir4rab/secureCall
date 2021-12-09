import React from 'react'
import Contacts from '../contacts/contacts';
import classes from './sidebar.module.scss';
import useTranslation from 'next-translate/useTranslation'

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
        <Contacts 
          setAddContactPopup={ setAddContactPopup } 
          setShowRequestsPopup={ setShowRequestsPopup } 
        />
      </div>
      <div className={ classes.footer }>
        <button className={ classes.buttonBlockDark2 }>
          {/* Settings */}
          { t('settings') }
        </button>
        <button className={ classes.buttonBlockDark2 }>
          { t('about') }
          {/* About */}
        </button>
      </div>
    </div>
  )
}

export default Sidebar
