import { createContext, useContext ,useState } from 'react';
import { io } from "socket.io-client";

import { ContactsContext } from '../contactsProvider/contactsProvider';

export const SocketsContext = createContext();

export const SocketsProvider = ({ children }) => {
  const {
    addContact,
    addRequest
  } = useContext(ContactsContext);
  const [ isConnected, setIsConnected ] = useState(false);
  const [ socket, setSocket ] = useState(null);
  const [ isInitialized, setIsInitialized ] = useState(false);

  const connect = async ( userData ) => {
    console.log({
      email: userData.email,
      accessToken: userData.jwt
    })
    const socket = io( process.env.NEXT_PUBLIC_SOCKET_IO_SERVER_URL, {
      auth: {
        email: userData.email,
        accessToken: userData.jwt
      }
    });

    socket.on('authenticated', ({ currentId, userData }) => {
      console.log(userData);
      addContact(userData.contacts);
      addRequest(userData.requests);
      setIsConnected(true)
    });

    socket.on('contacting request', senderData => {
      console.log(`request from ${senderData.email}`)
      addRequest(senderData)
    });

    setSocket(socket);
  }

  const contactRequest = ( recipientEmail ) => {
    console.log(socket)
    socket.emit('contact request', {
      recipientEmail
    });
    socket.on('request contact response', _ => console.log('Successful contact request!'))
  }

  const value = {
    connect,
    socket,
    isInitialized,
    contactRequest,
    isConnected
  };

  return (
    <SocketsContext.Provider value={value} >
      { children }
    </SocketsContext.Provider>
  )
};