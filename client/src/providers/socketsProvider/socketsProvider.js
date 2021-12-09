import { createContext, useContext ,useState, useEffect } from 'react';
import { io } from "socket.io-client";

import { ContactsContext } from '../contactsProvider/contactsProvider';

export const SocketsContext = createContext();

export const SocketsProvider = ({ children }) => {
  const {
    addContact,
    addRequest,
    removeRequest
  } = useContext(ContactsContext);
  const [ isConnected, setIsConnected ] = useState(false);
  const [ socket, setSocket ] = useState(null);
  const [ isInitialized, setIsInitialized ] = useState(false);

  // const [ receivingCall, setReceivingCall ] = useState(false);
  const [ receivingCall, setReceivingCall ] = useState(null);
  const [ callIsAnswered, setCallIsAnswered ] = useState(false);

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
      // console.log(userData);
      addContact( userData.contacts, true );
      addRequest( userData.requests, true );
      setIsConnected(true)
    });

    socket.on('contactingRequest', data => {
      console.log(`request from ${data.name}`, data)
      addRequest(data)
    });

    socket.on('acceptedContactRequest', contact => addContact(contact) );

    socket.on('receivingCall', callDetails => {
      console.log(`Receiving call from ${callDetails.from}`)
      setReceivingCall(callDetails)
    });

    socket.on('callAnswered', _ => setCallIsAnswered(true));

    console.log('setting socket')
    setSocket(socket);
  }

  const contactRequest = ( recipientEmail ) => {
    // console.log(socket)
    return new Promise((resolve) => {
      socket.emit(
        'contact request', 
        {
          recipientEmail
        },
        response => resolve(response)
      );
    })
    // socket.on('request contact response', _ => console.log('Successful contact request!'))
  }

  const responseToRequest = ( email, isAccepted ) => {
    return new Promise((resolve) => {
      if ( isAccepted ) {
          socket.emit(
            'requestResponse', 
            {
              recipientEmail: email,
              isAccepted: true
            },
            response => {
              console.log(response)
              removeRequest(email);
              resolve(response)
            }
          );
        } else {
          socket.emit(
            'requestResponse', 
            {
              recipientEmail: email,
              isAccepted: false
            },
            response => {
              console.log(response)
              removeRequest(email);
              resolve(response)
            }
          );
        }
    })
  }

  const call = ( peerJsId, to, type ) => {
    console.log(socket);
    return new Promise((resolve) => { 
      console.log('calling')
      socket.emit('call', {
        peerJsId,
        to,
        type
      }, response => resolve(response))
    })
  };

  const answerCall = ( to ) => {
    socket.emit('callAnswered', {
      to
    })
    setCallIsAnswered(true);
  }

  const declineCall = ( to ) => {
    socket.emit('declineCall', {
      to
    })
    setReceivingCall(null);
  }
  
  const value = {
    connect,
    socket,
    isInitialized,
    contactRequest,
    isConnected,
    responseToRequest,
    call,
    answerCall,
    receivingCall,
    callIsAnswered,
    declineCall
  };

  return (
    <SocketsContext.Provider value={value} >
      { children }
    </SocketsContext.Provider>
  )
};