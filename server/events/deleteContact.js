const isEmailValid = require('../utils/isEmailValid');
const getIdFromEmail = require('../utils/getIdFromEmail');

const deleteContact = async ( data, callback, { client, activeUsers, socket } ) => {
  const socketEmail = activeUsers.get(socket.id);
  const {
    email
  } = data;
  const validEmail = isEmailValid(email, callback);
  if ( !validEmail ) {
    return;
  }

  await client.connect();
  const database = client.db('secureCall');
  const users = database.collection('users');

  const receiver = await users.findOne({ email: email });
  const sender = await users.findOne({ email: socketEmail });

  if ( receiver === null || receiver === null ) {
    await client.close();
    try {
      callback({
        status: 'error',
        response: 'Something went wrong.'
      })
    } catch {};
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

  const recipientSocketId = getIdFromEmail( email, activeUsers );
  if ( recipientSocketId !== null ) { //** sending recipient the contact accept event **//
    socket.to(recipientSocketId).emit('contactRemoval', sender.email );
  }

  try {
    callback({
      status: 'successful',
      response: 'Successfully removed the contact.'
    });
  } catch {}
};

module.exports = deleteContact