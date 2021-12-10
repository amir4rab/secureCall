const call = async ( data, callback, { client, userDbData, activeUsers, socket } ) => {
  console.log('calling')
  const {
    to
  } = data;
  await client.connect();
  const database = client.db('secureCall');
  const users = database.collection('users');
  const query = {
    email: to
  };
  const receiver = await users.findOne(query);

  if( receiver === null ) { //** checks if the recipient does not exists **//
    await client.close();
    callback({
      status: 'error',
      response: 'User does not exists!',
      responseCode: 'userDNE'
    });
    return;
  }
  
  console.log(`Calling ${to} from ${userDbData.email}`)
  if(  typeof receiver.contacts.find( contact => contact.email === userDbData.email ) == 'undefined' ) {
    await client.close();
    callback({
      status: 'error',
      response: 'User is not in your contacts!',
      responseCode: 'userINIYC'
    });
    return;
  }

  const recipientSocketId = activeUsers.get(to);

  if( typeof recipientSocketId == 'undefined' ) {
    await client.close();
    callback({
      status: 'error',
      response: 'User is offline!',
      responseCode: 'userIsOffline'
    });
    return;
  }

  //** sending recipient the request event **//
  socket.to(recipientSocketId).emit('receivingCall', ({
    peerJsId: data.peerJsId,
    type: data.type,
    from: userDbData.email,
    name: userDbData.name
  }));
}

module.exports = call;