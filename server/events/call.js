const getIdFromEmail = require('../utils/getIdFromEmail');
const isEmailValid = require('../utils/isEmailValid');

const call = async ( data, callback, { client, activeUsers, socket } ) => {
  const socketEmail = activeUsers.get(socket.id);
  const {
    to
  } = data;

  if ( !isEmailValid(to) ){
    try {
      callback({
        status: 'error',
        response: 'Invalid inputs!',
        responseCode: 'invalid'
      })
    } catch {};
    return;
  }

  await client.connect();
  const database = client.db('secureCall');
  const users = database.collection('users');
  const query = {
    email: to
  };
  const receiver = await users.findOne(query);
  const userDbData = await users.findOne({ email: socketEmail });


  if( receiver === null ) { //** checks if the recipient does not exists **//
    await client.close();
    try {
      callback({
        status: 'error',
        response: 'User does not exists!',
        responseCode: 'userDNE'
      });
    } catch {}
    return;
  }

  console.log(`Calling ${to} from ${userDbData.email}`)
  if(  typeof receiver.contacts.find( contact => contact.email === userDbData.email ) == 'undefined' ) {
    await client.close();
    try {
      callback({
        status: 'error',
        response: 'User is not in your contacts!',
        responseCode: 'userINIYC'
      });
    } catch {}
    return;
  }

  const recipientSocketId = getIdFromEmail(to, activeUsers);
  if( recipientSocketId === null ) {
    await client.close();
    try {
      callback({
        status: 'error',
        response: 'User is offline!',
        responseCode: 'userIsOffline'
      });
    } catch {}
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