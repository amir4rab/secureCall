const getIdFromEmail = require('../utils/getIdFromEmail');
const isEmailValid = require('../utils/isEmailValid');

const call = async ( data, callback, { client, activeUsers, socket } ) => {
  const socketEmail = activeUsers.get(socket.id);
  const { recipientEmail } = data;

  if ( !isEmailValid(recipientEmail) ){
    callback && callback({
      status: 'error',
      response: 'Invalid inputs!',
      responseCode: 'invalid'
    });
  }

  await client.connect();
  const database = client.db('secureCall');
  const users = database.collection('users');
  const receiver = await users.findOne({ email: recipientEmail });
  const userDbData = await users.findOne({ email: socketEmail });


  if( receiver === null ) { //** checks if the recipient does not exists **//
    await client.close();
    callback && callback({
      status: 'error',
      response: 'User does not exists!',
      responseCode: 'userDNE'
    });
    return;
  }

  console.log(`Calling ${ recipientEmail } from ${userDbData.email}`)
  if(  typeof receiver.contacts.find( contact => contact.email === userDbData.email ) == 'undefined' ) {
    await client.close();
    callback && callback({
      status: 'error',
      response: 'User is not in your contacts!',
      responseCode: 'userINIYC'
    });
    return;
  }

  const recipientSocketId = getIdFromEmail( recipientEmail , activeUsers);
  if( recipientSocketId === null ) {
    await client.close();
    callback && callback({
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