const validator = require('validator');
const getIdFromEmail = require('../utils/getIdFromEmail');

const contactRequest = async ( data, callback, { client, activeUsers, socket } ) => {
  const socketEmail = activeUsers.get(socket.id);
  const {
    recipientEmail
  } = data;
  await client.connect();
  const database = client.db('secureCall');
  const users = database.collection('users');
  const query = {
    email: recipientEmail
  };

  console.log(socket.id);
  const userDbData = await users.findOne({ email: socketEmail });

  const recipientEmailIsValid = validator.isEmail(recipientEmail);
  if ( !recipientEmailIsValid ) {
    await client.close();
    try {
      callback({
        recipientEmail,
        status: 'error',
        response: 'Invalid Email address!',
        responseCode: 'invalidInput'
      });
    } catch {};
    return;
  }

  const receiver = await users.findOne(query);

  if( receiver === null ) { //** checks if the recipient does not exists **//
    await client.close();
    try {
      callback({
        recipientEmail,
        status: 'error',
        response: 'User does not exists!',
        responseCode: 'userDNE'
      });
    } catch {};
    return;
  } else if ( recipientEmail === userDbData.email ) { //** checks if the recipient email is wrong **//
    await client.close();
    try {
      callback({
        recipientEmail,
        status: 'error',
        response: "You can't sent a request to yourself!",
        responseCode: 'selfReq'
      });
    } catch {};
    return;
  }

  if ( receiver.requests.length > 10 ) { //** recipient request inbox is full **//

    await client.close();
    try {
      callback({
        recipientEmail,
        status: 'error',
        response: `${recipientEmail} inbox is full!`,
        responseCode: 'fullInbox'
      });
    } catch {};
  } else if ( typeof receiver.requests.find( request => request.email === userDbData.email ) !== 'undefined' ) { //** recipient already has a request from sender **//

    await client.close();
    try {
      callback({
        recipientEmail,
        status: 'successful',
        response: `${recipientEmail} already has a request from you!`,
        responseCode: 'dupReq'
      });
    } catch {};

  } else if ( typeof receiver.contacts.find( contact => contact.email === userDbData.email ) !== 'undefined' ) { //** recipient is already a contact **//

    await client.close();

    try {
      callback({
        recipientEmail,
        status: 'successful',
        response: `${recipientEmail} is in your contacts!`,
        responseCode: 'dupCon'
      });
    } catch {};

  } else if ( typeof userDbData.requests.find( request => request.email === receiver.email ) !== 'undefined' ) { //** request sender already has a request from the receiver **//

    await client.close();
    try {
      callback({
        recipientEmail,
        status: 'error',
        response: `You already have a request from ${recipientEmail}!`,
        responseCode: 'hasReq'
      })
    } catch {};
  } else { //** adding request to recipient's request inbox  **//
    const requests = [
      {
        email: userDbData.email,
        name: userDbData.name
      },
      ...receiver.requests
    ];
  
    const updateDocument = {
      $set: {
        requests,
      },
    };
  
    await users.updateOne({ _id: receiver._id }, updateDocument );
    await client.close();
    const recipientSocketId = getIdFromEmail(recipientEmail, activeUsers);
    if ( recipientSocketId !== null ) { //** sending recipient the request event **//
      socket.to(recipientSocketId).emit('contactingRequest', ({
        name: userDbData.name,
        email: userDbData.email
      }));
    }

    try {
      callback({
        recipientEmail,
        status: 'successful',
        response: 'Request has been sent.',
        responseCode: 'successful'
      });
    } catch {};
  }
}

module.exports = contactRequest;