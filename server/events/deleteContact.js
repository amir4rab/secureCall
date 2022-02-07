const isEmailValid = require('../utils/isEmailValid');
const getIdFromEmail = require('../utils/getIdFromEmail');

const deleteContact = async ( data, callback, { client, activeUsers, socket } ) => {
  const socketEmail = activeUsers.get(socket.id);
  const { recipientEmail } = data;
  const validEmail = isEmailValid( recipientEmail, callback );
  if ( !validEmail ) {
    await client.close();
    callback && callback({
      status: 'error',
      response: 'Invalid email!.'
    })
    return;
  }

  await client.connect();
  const database = client.db('secureCall');
  const users = database.collection('users');

  const receiver = await users.findOne({ email: recipientEmail });
  const sender = await users.findOne({ email: socketEmail });

  if ( receiver === null || receiver === null ) {
    await client.close();
    callback && callback({
      status: 'error',
      response: 'Something went wrong.'
    })
    return;
  }

  const receiverNewContacts = receiver.contacts.filter( contact => contact.email !== socketEmail );
  const updateReceiverDocument = {
    $set: {
      contacts: receiverNewContacts
    },
  };

  const senderNewContacts = sender.contacts.filter( contact => contact.email !== receiver.email );
  const updateSenderDocument = {
    $set: {
      contacts: senderNewContacts
    },
  };

  await users.updateOne({ _id: sender._id }, updateSenderDocument );
  await users.updateOne({ _id: receiver._id }, updateReceiverDocument );

  await client.close();

  const recipientSocketId = getIdFromEmail( recipientEmail, activeUsers );
  if ( recipientSocketId !== null ) { //** sending recipient the contact accept event **//
    socket.to(recipientSocketId).emit('contactRemoval', ({ email: sender.email }) );
  }

  callback && callback({
    status: 'successful',
    response: 'Successfully removed the contact.'
  });
};

module.exports = deleteContact