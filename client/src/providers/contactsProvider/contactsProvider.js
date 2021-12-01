import { createContext, useEffect, useState, useRef } from 'react';

export const ContactsContext = createContext();

const boilerPlateContacts = [
  {
    "name": "Maryam",
    "email": "maryam@tes.com",
    "image": null,
    "id": "maryam@tes.com"
  },
  {
    "name": "Hesam",
    "email": "hesam@tes.com",
    "image": null,
    "id": "hesam@tes.com"
  },
  {
    "name": "Max",
    "email": "max@tes.com",
    "image": null,
    "id": "max@tes.com"
  },
  {
    "name": "Jack",
    "email": "jack@tes.com",
    "image": null,
    "id": "jack@tes.com"
  },
];

export const ContactsProvider = ({ children }) => {
  const [ contacts, setContacts ] = useState([]);
  const [ requests, setRequests ] = useState([]);

  const [ activeContact, setActiveContact ] = useState(null);
  const addContact = (newContact) => {
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
  const addRequest = (newContact) => {
    if ( Array.isArray(newContact) ) {
      setRequests(oldContacts => [
        ...oldContacts,
        ...newContact
      ])
      return;
    }
    if( typeof newContact === 'object' ) {
      setRequests(oldContacts => [
        ...oldContacts,
        newContact
      ])
      return;
    } 
  };

  const getContact = (id) => {
    const contact = contacts.find(contact => contact.id === id);
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
    requests,
    activeContact,
    contacts,
  }

  return (
    <ContactsContext.Provider value={ value }>
      { children }
    </ContactsContext.Provider>
  )
}