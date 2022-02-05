import { createContext, useContext ,useState, useEffect, useCallback } from 'react';
import { io } from "socket.io-client";

import { ContactsContext } from '../contactsProvider/contactsProvider';

export const SocketsContext = createContext();

export const SocketsProvider = ({ children }) => {
  const {
    addContact,
    removeContact,
    addRequest,
    addBlockedUser,
    removeBlockedUser,
    removeRequest
  } = useContext(ContactsContext);
  const [ isConnected, setIsConnected ] = useState(false);
  const [ socket, setSocket ] = useState(null);

  const [ callDeclined, setCallDeclined ] = useState(false);
  const [ callEnded, setCallEnded ] = useState(null);
  const [ receivingCall, setReceivingCall ] = useState(null);
  const [ callIsAnswered, setCallIsAnswered ] = useState(false);
  const [ isInCall, setIsInCall ] = useState(false);

  const connect = async ( userData ) => {
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
      addBlockedUser( userData.banList, true );
      setIsConnected(true)
    });

    socket.on('contactingRequest', data => {
      console.log(`request from ${data.name}`, data)
      addRequest(data)
    });

    socket.on('acceptedContactRequest', contact => addContact(contact) );

    socket.on('receivingCall', callDetails => {
      console.log(`Receiving call from ${callDetails.from}`);
      if( !isInCall ) {
        console.warn(`Setting receiving call!`)
        setReceivingCall(callDetails)
      } else {
        console.log(`Call has been failed!, reason: Receiver is busy!`);
        socket.emit('callDeclined', {
          to: callDetails.from,
          reason: 'Receiver is busy'
        })
      }
    });

    socket.on('callEnd', ({ from, reason }) => {
      console.log('Call end event');
      const time = new Date();
      setCallEnded({
        from,
        reason,
        time: time.valueOf()
      })
    })

    socket.on('callAnswered', _ => setCallIsAnswered(true));

    socket.on('contactRemoval', email => removeContact(email));

    console.log('setting socket')
    setSocket(socket);
  }

  const contactRequest = ( recipientEmail ) => {
    return new Promise((resolve) => {
      socket.emit(
        'contact request', 
        {
          recipientEmail
        },
        response => resolve(response)
      );
    })
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

  const declineCall = useCallback(( to, reason= 'not answered' ) => {
    socket.emit('endCall', {
      to,
      reason
    })
    setReceivingCall(null);
  }, [ socket ])

  const deleteContact = async ( contactEmail ) => new Promise((resolve) => {
    socket.emit(
      'deleteContact', 
      {
        email: contactEmail
      },
      res => {
        resolve(res);
        removeContact({ email: contactEmail });
      })
  });

  const clearEndedCall = _ => {
    setCallEnded(null);
  }

  const clearCallingInfo = () => {
    console.log('call cleared!')
    setIsInCall(false);
    setCallIsAnswered(false);
    setReceivingCall(null);
    setCallDeclined(false);
    setCallEnded(null);
  }
  
  const endCall = ( to, reason= 'not answered' ) => new Promise(( resolve ) => {
    socket.emit('callEnd', {
      to,
      reason
    }, res => {
      console.log(res)
      clearCallingInfo();
      resolve(null);
    });
  });

  const banUser = ( contactEmail ) => new Promise( async ( resolve ) => {
    socket.emit(
      'banRequest', 
      {
        email: contactEmail
      },
      response => {
        resolve(response)
        removeContact({ email: contactEmail });
        addBlockedUser(contactEmail);
      }
    );
  });

  const unBanUser = ( contactEmail ) => new Promise( async ( resolve ) => {
    socket.emit(
      'unBanRequest', 
      {
        email: contactEmail
      },
      response => {
        console.log(response);
        resolve(response)
        removeBlockedUser(contactEmail);
      }
    );
  });
  
  const value = {
    connect,
    socket,
    contactRequest,
    isConnected,
    responseToRequest,
    call,
    answerCall,
    receivingCall,
    callIsAnswered,
    declineCall,
    callDeclined,
    deleteContact,
    endCallEvent: endCall,
    callEnded,
    clearCallingInfo,
    clearEndedCall,
    banUser,
    unBanUser
  };

  return (
    <SocketsContext.Provider value={value} >
      { children }
    </SocketsContext.Provider>
  )
};