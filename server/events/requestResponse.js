const requestResponse = async ( data, callback, { client, userDbData, activeUsers, socket } ) => {
  
  const {
    recipientEmail,
    isAccepted
  } = data;
  await client.connect();
  const database = client.db('secureCall');
  const users = database.collection('users');

  
  const querySender = { email: userDbData.email };
  const sender = await users.findOne(querySender); //** sender has a request from reciver **//
  
  if ( sender === null ) {
    await client.close();
    callback({
      status: 'error',
      response: 'User does not exists!'
    });
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
      callback({
        status: 'error',
        response: 'User does not exists!'
      });
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

    const recipientSocketId = activeUsers.get(recipientEmail);
    if ( recipientSocketId ) { //** sending recipient the contact accept event **//
      socket.to(recipientSocketId).emit('acceptedContactRequest', ({
        name: sender.name,
        email: sender.email
      }));
    }

    callback({
      status: 'successful',
      response: 'Successfully accepted the request.'
    });
  }
};

module.exports = requestResponse;