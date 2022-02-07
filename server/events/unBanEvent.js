const getIdFromEmail = require('../utils/getIdFromEmail');
const isEmailValid = require('../utils/isEmailValid');

const ubBanEvent = async ( data, callback, { client, activeUsers, socket } ) => {
  const socketEmail = activeUsers.get(socket.id);
  const { recipientEmail } = data;

  if ( !isEmailValid( recipientEmail ) ){
    callback && callback({
      status: 'error',
      response: 'Invalid inputs!',
      responseCode: 'invalid'
    })
    return;
  }

  await client.connect();
  const database = client.db('secureCall');
  const users = database.collection('users');
  const userDbData = await users.findOne({ email: socketEmail });
  const updatedUserDocument = {
    $set: {
      banList: userDbData.banList.filter( banedUserEmail => banedUserEmail !== recipientEmail )
    },
  };

  await users.updateOne({ _id: userDbData._id }, updatedUserDocument );

  await client.close();

  callback && callback({
    status: 'successful',
    response: 'Successfully accepted the request.'
  });
};

module.exports = ubBanEvent;