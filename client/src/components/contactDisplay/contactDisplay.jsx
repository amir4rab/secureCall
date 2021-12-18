import { useContext } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { ContactsContext } from '../../providers/contactsProvider/contactsProvider';

import classes from './contactDisplay.module.scss';
import ContactCard from './contactCard/contactCard';

function ContactDisplay() {
  const { t } = useTranslation('contactDisplay');
  const { activeContact } = useContext(ContactsContext);

  return (
    <div className={[ classes.contactDisplay, !activeContact && classes.hidden ].join(' ')}>
      {
        activeContact === null ?
        <p className={ classes.prompt } >{ t('selectAContact') }</p>
        :
        <ContactCard contact={ activeContact } />
      }
    </div>
  )
}

export default ContactDisplay
