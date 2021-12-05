const contactRequest = async ( data, callback, { client, userDbData, socketEmail, activeUsers, socket } ) => {
  const {
    recipientEmail
  } = data;
  await client.connect();
  const database = client.db('secureCall');
  const users = database.collection('users');
  const query = {
    email: recipientEmail
  };
  const reciver = await users.findOne(query);

  if( reciver === null ) { //** checks if the recipient does not exists **//
    await client.close();
    callback({
      status: 'error',
      response: 'User does not exists!'
    });
    return;
  } else if ( recipientEmail === userDbData.email ) { //** checks if the recipient email is wrong **//
    await client.close();
    callback({
      status: 'error',
      response: "You can't sent a request to yourself!"
    });
    return;
  }

  if ( reciver.requests.length > 10 ) { //** recipient request inbox is full **//

    await client.close();

    callback({
      status: 'error',
      response: `${recipientEmail} inbox is full!`
    });

  } else if ( typeof reciver.requests.find( request => request.email === userDbData.email ) !== 'undefined' ) { //** recipient already has a request from sender **//

    await client.close();

    callback({
      status: 'successful',
      response: `${recipientEmail} already has a request from you!`
    });

  } else if ( typeof reciver.contacts.find( contact => contact.email === userDbData.email ) !== 'undefined' ) { //** recipient is already a contact **//

    await client.close();

    callback({
      status: 'successful',
      response: `${recipientEmail} is in your contacts!`
    });

  } else { //** adding request to recipient's request inbox  **//

    // console.log(`${}`)

    const requests = [
      {
        email: userDbData.email,
        name: userDbData.name
      },
      ...reciver.requests
    ];
  
    const updateDocument = {
      $set: {
        requests,
      },
    };
  
    await users.updateOne({ _id: reciver._id }, updateDocument );
    await client.close();


    const recipientSocketId = activeUsers.get(recipientEmail);
    if ( recipientSocketId ) { //** sending recipient the request event **//
      console.log(`sending request to ${recipientEmail}:${recipientSocketId}`);
      console.log({
        name: userDbData.name,
        email: userDbData.email
      })
      socket.to(recipientSocketId).emit('contactingRequest', ({
        name: userDbData.name,
        email: userDbData.email
      }));
    }

    callback({
      status: 'successful',
      response: 'Request has been sent.'
    });
  }
}

module.exports = contactRequest;