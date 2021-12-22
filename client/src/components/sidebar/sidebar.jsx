import { useContext, useState } from 'react';
import { useRouter } from 'next/router';

import useTranslation from 'next-translate/useTranslation';

import Contacts from '../contacts/contacts';
import PopupButtons from './popupButtons';
import AddContactsPopup from '../popups/addContactPopup/addContactsPopup';
import RequestsPopup from '../popups/requestsPopup/requestsPopup';

import { ContactsContext } from '../../providers/contactsProvider/contactsProvider';

import classes from './sidebar.module.scss';

import MobileMenu from '../mobileMenu/mobileMenu';

function Sidebar() {
  const router = useRouter();
  const [ addContactPopup, setAddContactPopup ] = useState(false);
  const [ showRequestsPopup, setShowRequestsPopup ] = useState(false);
  const { activeContact } = useContext(ContactsContext)
  const { t } = useTranslation('sidebar');

  return (
    <div className={[ classes.sidebar, activeContact && classes.hidden ].join(' ')}>
      <AddContactsPopup   
        displayState={ addContactPopup } 
        setDisplayState={ setAddContactPopup } 
      />
      <RequestsPopup
        displayState={ showRequestsPopup } 
        setDisplayState={ setShowRequestsPopup } 
      />
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
        <button onClick={ _ => router.push('panel/settings')} className={ classes.buttonBlockDark2 }>
          { t('settings') }
        </button>
      </div>
      <MobileMenu
        setAddContactPopup={ _ => setAddContactPopup(true) }
        setShowRequestsPopup={ _ => setShowRequestsPopup(true) }
      />
    </div>
  )
}

export default Sidebar
