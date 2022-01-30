const getIdFromEmail = require('../utils/getIdFromEmail');
const isEmailValid = require('../utils/isEmailValid');

const banEvent = async ( data, callback, { client, activeUsers, socket } ) => {
  const socketEmail = activeUsers.get(socket.id);
  const {
    email: recipientEmail
  } = data;

  if ( !isEmailValid( recipientEmail ) ){
    callback && callback({
      status: 'error',
      response: 'Invalid inputs!',
      responseCode: 'invalid'
    })
    return;
  }

  await client.connect();
  const database = client.db('secureCall');
  const users = database.collection('users');

  const userDbData = await users.findOne({ email: socketEmail });
  if( userDbData.banList.includes(recipientEmail) ) { // checking if the recipient is already blocked
    await client.close();
    callback && callback({
      status: 'error',
      response: 'contact is blocked already!',
      responseCode: 'alreadyBlocked'
    });
    return;
  }
  const updatedUserDocument = {
    $set: {
      requests: userDbData.requests.filter(contact => contact.email !== recipientEmail),
      contacts: userDbData.contacts.filter(contact => contact.email !== recipientEmail),
      banList: [ ...userDbData.banList, recipientEmail ]
    },
  };

  const receiver = await users.findOne({ email:  recipientEmail  });
  const updatedReceiverDocument = {
    $set: {
      requests: receiver.requests.filter(contact => contact.email !== socketEmail),
      contacts: receiver.contacts.filter(contact => contact.email !== socketEmail)
    },
  };

  await Promise.all([
    users.updateOne({ _id: userDbData._id }, updatedUserDocument ),
    users.updateOne({ _id: receiver._id }, updatedReceiverDocument )
  ]);

  await client.close();

  const recipientSocketId = getIdFromEmail( recipientEmail, activeUsers );
  if ( recipientSocketId !== null ) { //** sending recipient the contact accept event **//
    socket.to(recipientSocketId).emit('contactRemoval', ({
      email: socketEmail
    }));
  };

  callback && callback({
    status: 'successful',
    response: 'Successfully accepted the request.'
  });
};

module.exports = banEvent;