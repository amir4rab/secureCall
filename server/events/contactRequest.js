const validator = require('validator');
const getIdFromEmail = require('../utils/getIdFromEmail');

const contactRequest = async ( data, callback, { client, activeUsers, socket } ) => {
  const socketEmail = activeUsers.get(socket.id);
  const {
    recipientEmail
  } = data;

  const recipientEmailIsValid = validator.isEmail(recipientEmail); 
  if ( !recipientEmailIsValid ) { //** verifying recipient email address **//
    await client.close();
    callback && callback({
        recipientEmail,
        status: 'error',
        response: 'Invalid Email address!',
        responseCode: 'invalidInput'
      });
    return;
  }

  await client.connect();
  const database = client.db('secureCall');
  const users = database.collection('users');

  const userDbData = await users.findOne({ email: socketEmail });
  const receiver = await users.findOne({ email: recipientEmail });

  if( receiver === null ) { //** checks if the recipient does not exists **//
    await client.close();
    callback && callback({
        recipientEmail,
        status: 'error',
        response: 'User does not exists!',
        responseCode: 'userDNE'
      });
    return;
  };

  if ( recipientEmail === userDbData.email ) { //** checks if the recipient email is wrong **//
    await client.close();
    callback && callback({
      recipientEmail,
      status: 'error',
      response: "You can't sent a request to yourself!",
      responseCode: 'selfReq'
    });
    return;
  };

  if ( receiver.banList.includes( socketEmail ) ) { //** recipient have blocked senders account **//
    await client.close();
    callback && callback({
        recipientEmail,
        status: 'error',
        response: `${recipientEmail} inbox is full!`,
        responseCode: 'blockedYou'
      });
    return;
  };

  if ( userDbData.banList.includes( recipientEmail ) ) { //** senders have blocked recipient account **//
    await client.close();
    callback && callback({
      recipientEmail,
      status: 'error',
      response: `${recipientEmail} inbox is full!`,
      responseCode: 'youBlocked'
    });
    return;
  };

  if ( receiver.requests.length > 10 ) { //** recipient request inbox is full **//

    await client.close();
    callback && callback({
      recipientEmail,
      status: 'error',
      response: `${recipientEmail} inbox is full!`,
      responseCode: 'fullInbox'
    });
    return;
  };

  const alreadyInRequests = receiver.requests.find( request => request.email === userDbData.email );
  if ( typeof alreadyInRequests !== 'undefined' ) { //** recipient already has a request from sender **//

    await client.close();
    callback && callback({
      recipientEmail,
      status: 'successful',
      response: `${recipientEmail} already has a request from you!`,
      responseCode: 'dupReq'
    });
    return;

  };

  const alreadyInContacts = receiver.contacts.find( contact => contact.email === userDbData.email );
  if ( typeof alreadyInContacts !== 'undefined' ) { //** recipient is already a contact **//

    await client.close();

    callback && callback({
      recipientEmail,
      status: 'successful',
      response: `${recipientEmail} is in your contacts!`,
      responseCode: 'dupCon'
    });
    return;

  };

  const senderHaveRequest = userDbData.requests.find( request => request.email === receiver.email );
  if ( typeof senderHaveRequest !== 'undefined' ) { //** request sender already has a request from the receiver **//

    await client.close();
    callback && callback({
      recipientEmail,
      status: 'error',
      response: `You already have a request from ${recipientEmail}!`,
      responseCode: 'hasReq'
    });
    return;
  }

  //** adding request to recipient's request inbox  **//
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

  callback && callback({
    recipientEmail,
    status: 'successful',
    response: 'Request has been sent.',
    responseCode: 'successful'
  });
}

module.exports = contactRequest;