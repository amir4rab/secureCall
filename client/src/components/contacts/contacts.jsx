import React, { useContext } from 'react';
import Contact from './contact/contact';
import { ContactsContext } from '../../providers/contactsProvider/contactsProvider';
import classes from './contacts.module.scss';

function Contacts() {
  const { contacts, setActiveContact } = useContext(ContactsContext);

  return (
    <div className={ classes.contacts }>
      {
        contacts.map(contact => 
          <Contact 
            onClick={ _ => setActiveContact(contact) } 
            contact={ contact } 
            key={ contact.email } 
          />
        )
      }
    </div>
  )
}

export default Contacts
