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
  const { recipientEmail, reason: reasonType } = data;

  if ( !isEmailValid(recipientEmail) ){
    callback && callback({
      status: 'error',
      response: 'Invalid inputs!',
      responseCode: 'invalid'
    })
    return;
  }

  const recipientSocketId = getIdFromEmail( recipientEmail, activeUsers );
  if( recipientSocketId === null ) {
    callback && callback({
      status: 'error',
      response: 'User is offline!',
      responseCode: 'userIsOffline'
    });
  } else {
    socket.to(recipientSocketId).emit('callEnd', ({
      from: socketEmail,
      reason: getReasonString(reasonType)
    }));
    callback && callback({
      status: 'successful'
    })
  }

}

module.exports = endCallEvent;