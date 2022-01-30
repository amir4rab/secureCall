const getIdFromEmail = require('../utils/getIdFromEmail');
const isEmailValid = require('../utils/isEmailValid');

const getReasonString = ( reasonType ) => {
  switch(reasonType) {
    case 'ended': {
      return 'ended'
    }
    case 'decline': {
      return 'decline'
    }
    default: {
      return 'decline';
    }
  }
};

const endCallEvent = ( data, callback, { client, activeUsers, socket } ) => {
  const socketEmail = activeUsers.get(socket.id);
  const {
    to: recipientEmail,
    reason: reasonType
  } = data;
  console.log(`endCallEvent! from: ${socketEmail}, to ${recipientEmail}`);

  if ( !isEmailValid(recipientEmail) ){
    try {
      callback({
        status: 'error',
        response: 'Invalid inputs!',
        responseCode: 'invalid'
      })
    } catch {};
    return;
  }

  // let reasonString; 
  const recipientSocketId = getIdFromEmail( recipientEmail, activeUsers );
  if( recipientSocketId === null ) {
    try {
      callback({
        status: 'error',
        response: 'User is offline!',
        responseCode: 'userIsOffline'
      });
    } catch {}
  } else {
    socket.to(recipientSocketId).emit('callEnd', ({
      from: socketEmail,
      reason: getReasonString(reasonType)
    }));
    try {
      callback({
        status: 'successful'
      })
    } catch {}
  }

}

module.exports = endCallEvent;