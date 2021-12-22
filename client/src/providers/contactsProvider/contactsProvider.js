import { createContext, useState } from 'react';

export const ContactsContext = createContext();

export const ContactsProvider = ({ children }) => {
  const [ contacts, setContacts ] = useState([]);
  const [ requests, setRequests ] = useState([]);

  const [ activeContact, setActiveContact ] = useState(null);
  const addContact = ( newContact, init = false ) => {
    if ( init ) {
      setContacts([ ...newContact ]);
      return;
    }
    if ( Array.isArray(newContact) ) {
      setContacts(oldContacts => [
        ...oldContacts,
        ...newContact
      ])
      return;
    }
    if( typeof newContact === 'object' ) {
      setContacts(oldContacts => [
        ...oldContacts,
        newContact
      ])
      return;
    } 
  };
  const addRequest = ( newRequest, init = false ) => {
    if ( init ) {
      setRequests([ ...newRequest ]);
      return;
    }
    if ( Array.isArray(newRequest) ) {
      setRequests(oldContacts => [
        ...oldContacts,
        ...newRequest
      ])
      return;
    }
    if( typeof newRequest === 'object' ) {
      setRequests(oldContacts => [
        ...oldContacts,
        newRequest
      ])
      return;
    } 
  };

  const removeContact = ( contactEmail ) => {
    setContacts(oldContacts => oldContacts.filter( contact => contact.email !== contactEmail ));
    if ( contactEmail === activeContact?.email ) setActiveContact(null)
  };
  const removeRequest = ( requestEmail ) => {
    setRequests(oldRequests => oldRequests.filter( request => request.email !== requestEmail ));
  }

  const getContact = (email) => {
    const contact = contacts.find(contact => contact.email === email);
    return contact;
  }

  const init = async (contacts) => {
    setContacts(contacts);
  }

  const value = {
    init,
    addContact,
    getContact,
    setActiveContact,
    addRequest,
    removeRequest,
    requests,
    activeContact,
    contacts,
    removeContact
  }

  return (
    <ContactsContext.Provider value={ value }>
      { children }
    </ContactsContext.Provider>
  )
}