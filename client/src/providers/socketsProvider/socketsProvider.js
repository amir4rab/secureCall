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
  const [ callingTo, setCallingTo ] = useState(null);

  const [ callIsAnswered, setCallIsAnswered ] = useState(false);
  const [ isInCall, setIsInCall ] = useState(false);

  const [ callEndEvent, setCallEndEvent ] = useState(null);
  useEffect( _ => { //** onEnd Decline Event **//
    if ( callEndEvent === null ) return;
    console.log(`onEnd Decline Event`)
    const { from, reason } = callEndEvent;
    const time = new Date();
      console.log('Call end event', isInCall, from, receivingCall?.from, callingTo );
      console.log( from !== receivingCall?.from, from !== callingTo )
      if ( from !== receivingCall?.from && from !== callingTo ) {
        setCallEndEvent(null);
        return;
      }
      if ( receivingCall !== null ) {
        setReceivingCall(null);
      } else {
        setCallEnded({
          from,
          reason,
          time: time.valueOf()
        });
      }
      setCallEndEvent(null);
  }, [ callEndEvent, callingTo, receivingCall, isInCall ]);

  const [ callReceiveEvent, setCallReceiveEvent ] = useState(null);
  useEffect( _ => {  //** onCAll Receive Event **//
    if ( callReceiveEvent === null ) return;
    const callDetails = callReceiveEvent;
    console.log(`Receiving call from ${callDetails.from}`, `receivingCall: ${JSON.stringify(receivingCall)}`, `isInCall: ${isInCall}`);
      if ( receivingCall !== null || isInCall ) { // declines call when a notification is on display or user is in call
        console.warn(`Call has been failed!, reason: Receiver is busy!`);
        socket.emit( 'callEnd', {
          recipientEmail: callDetails.from,
          reason: 'Receiver is busy'
        })
        setCallReceiveEvent(null);
        return;
      }
      if( !isInCall ) { // saves the call details to the state
        setReceivingCall(callDetails);
        setCallReceiveEvent(null);
      }
  }, [ callReceiveEvent, isInCall, receivingCall, socket ])

  const connect = async ( userData ) => {
    const socket = io( process.env.NEXT_PUBLIC_SOCKET_IO_SERVER_URL , {
      auth: {
        email: userData.email,
        accessToken: userData.jwt
      }
    });

    socket.on('authenticated', ({ userData }) => {
      addContact( userData.contacts, true );
      addRequest( userData.requests, true );
      addBlockedUser( userData.banList, true );
      setIsConnected(true)
    });

    socket.on('contactingRequest', data => { addRequest(data) });

    socket.on('acceptedContactRequest', contact => addContact(contact) );

    socket.on('receivingCall', callDetails => { setCallReceiveEvent(callDetails) });

    socket.on('callEnd', ({ from, reason }) => { setCallEndEvent({ from, reason }) });

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
    console.log('here!', to);
    setCallingTo(to);
    return new Promise((resolve) => { 
      console.log('calling')
      socket.emit('call', {
        peerJsId,
        recipientEmail: to,
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
    socket.emit('callEnd', {
      recipientEmail: to,
      reason
    })
    setCallingTo(null);
    setReceivingCall(null);
  }, [ socket ])

  const clearEndedCall = _ => {
    setCallEnded(null);
  }
  
  const endCall = ( to, reason= 'not answered' ) => new Promise(( resolve ) => {
    socket.emit('callEnd', {
      recipientEmail: to,
      reason
    }, _ => {
      clearCallingInfo();
      resolve(null);
    });
  });

  const clearCallingInfo = () => {
    console.log('call cleared!')
    setIsInCall(false);
    setCallIsAnswered(false);
    setReceivingCall(null);
    setCallDeclined(false);
    setCallEnded(null);
    setCallingTo(null);
  }

  const deleteContact = async ( contactEmail ) => new Promise((resolve) => {
    socket.emit(
      'deleteContact', 
      {
        recipientEmail: contactEmail
      },
      res => {
        resolve(res);
        removeContact({ email: contactEmail });
      })
  });

  const banUser = ( contactEmail ) => new Promise( async ( resolve ) => {
    socket.emit(
      'banRequest', 
      {
        recipientEmail: contactEmail
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
        recipientEmail: contactEmail
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