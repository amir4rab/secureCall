import { useContext } from 'react';
import Contact from './contact/contact';
import { ContactsContext } from '../../providers/contactsProvider/contactsProvider';
import classes from './contacts.module.scss';
import { useRouter } from 'next/router';
import GoIncognito from './goIncognito/goIncognito';

function Contacts() {
  const router = useRouter();
  const { contacts, setActiveContact } = useContext(ContactsContext);

  return (
    <div className={ classes.contacts }>
      <Contact 
        onClick={ _ => router.push('/incognito') }
        customContact
      >
        <GoIncognito />
      </Contact>
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
