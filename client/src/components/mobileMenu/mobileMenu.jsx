import { useState, useContext } from 'react'
import { useRouter } from 'next/router';

import useTranslation from 'next-translate/useTranslation';
import { ContactsContext } from '../../providers/contactsProvider/contactsProvider';

import { IoAdd, IoClose, IoPersonAdd, IoMail, IoSettings, IoMailUnread } from 'react-icons/io5';

import classes from './mobileMenu.module.scss';


function MobileMenu({ setAddContactPopup, setShowRequestsPopup }) {
  const { requests } = useContext(ContactsContext);
  const { t } = useTranslation('sidebar');
  const [ modalState, setModalState ] = useState(false);
  const router = useRouter();

  const overlayEventHandler = e => {
    console.log(e.target.id);
    if( e.target.id === 'mobileMenuOverlay' ) {
      setModalState(false);
    }
  }

  return (
    <div className={[ classes.mobileMenu, modalState ? classes.open : classes.close ].join(' ')}>
      <button className={ classes.button } onClick={ _ => setModalState(true) }>
        <IoAdd />
      </button>
      <div className={ classes.modal }>
        <div className={ classes.modalInner }>
          <button onClick={ _ => setModalState(false) } className={ classes.closeBtn }>
            <IoClose />
          </button>
          <button onClick={ setAddContactPopup } className={ classes.imageBtn }>
            <div className={ classes.svgWrapper }>
              <IoPersonAdd />
            </div>
            <p>{t('addContact')}</p>
          </button>
          <button onClick={ setShowRequestsPopup } className={ classes.imageBtn }>
            <div className={ classes.svgWrapper }>
              { requests.length === 0 ? <IoMail /> : <IoMailUnread /> }
            </div>
            <p>{ t('requests') }</p>
          </button>
          <button onClick={ _ => router.push('panel/settings') } className={ classes.imageBtn }>
            <div className={ classes.svgWrapper }>
              <IoSettings />
            </div>
            <p>{t('settings')}</p>
          </button>
        </div>
      </div>
      <div className={ classes.overlay } id='mobileMenuOverlay' onClick={ overlayEventHandler }>
      </div>
    </div>
  )
}

export default MobileMenu
