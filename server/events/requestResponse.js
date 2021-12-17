const isEmailValid = require('../utils/isEmailValid');
const getIdFromEmail = require('../utils/getIdFromEmail');

const requestResponse = async ( data, callback, { client, activeUsers, socket } ) => {
  const socketEmail = activeUsers.get(socket.id);
  const {
    recipientEmail,
    isAccepted
  } = data;
  const isValid = isEmailValid(recipientEmail, callback);
  if ( !isValid ) {
    return;
  }
  if ( typeof isAccepted !== 'boolean' ) {
    try {
      callback({
        status: 'error',
        response: 'false inputs'
      });
    } catch {};
    return;
  };

  await client.connect();
  const database = client.db('secureCall');
  const users = database.collection('users');

  const userDbData = await users.findOne({ email: socketEmail });


  const querySender = { email: userDbData.email };
  const sender = await users.findOne(querySender); //** sender has a request from reciver **//
  
  if ( sender === null ) {
    await client.close();
    try {
      callback({
        status: 'error',
        response: 'User does not exists!'
      });
    } catch {};
    return;
  }

  if ( !isAccepted ) { //** declined request **//
    console.log('declined request')
    const senderRequests = sender.requests.filter( request => request.email !== recipientEmail )
    
    const updateSenderDocument = {
      $set: {
        requests: senderRequests,
      },
    };

    await users.updateOne({ _id: sender._id }, updateSenderDocument );
    await client.close();

    callback({
      status: 'successful',
      response: 'Successfully declined the request.'
    });
    return;
  } else { //** accepted request **//
    const queryReceiver = { email: recipientEmail };
    const receiver = await users.findOne(queryReceiver);

    if ( receiver === null ) {
      await client.close();
      try {
        callback({
          status: 'error',
          response: 'User does not exists!'
        });
      } catch {};
      return;
    }

    const senderRequests = sender.requests.filter( request => request.email !== recipientEmail )
    const senderContacts = [
      ...sender.contacts,
      {
        name: receiver.name,
        email: receiver.email,
      }
    ];
    const updateSenderDocument = {
      $set: {
        requests: senderRequests,
        contacts: senderContacts
      },
    };

    const updateReceiverDocument = {
      $set: {
        contacts: [
          ...receiver.contacts,
          {
            name: userDbData.name,
            email: userDbData.email,
          }
        ]
      },
    };

    await Promise.all([
      users.updateOne({ _id: sender._id }, updateSenderDocument ),
      users.updateOne({ _id: receiver._id }, updateReceiverDocument )
    ]);

    await client.close();

    const recipientSocketId = getIdFromEmail( recipientEmail, activeUsers );
    if ( recipientSocketId !== null ) { //** sending recipient the contact accept event **//
      socket.to(recipientSocketId).emit('acceptedContactRequest', ({
        name: sender.name,
        email: sender.email
      }));
    }
    try {
      callback({
        status: 'successful',
        response: 'Successfully accepted the request.'
      });
    } catch {};
  }
};

module.exports = requestResponse;