const getUserData = async ( email ,client, includeSensitiveData = false ) => {
  await client.connect();
  const database = client.db('secureCall');
  const users = database.collection('users');
  const userDBData = await users.findOne({ email });
  await client.close();
  if ( includeSensitiveData ) {
    return userDBData;
  } else {
    return {
      requests: userDBData.requests,
      contacts: userDBData.contacts,
      banList: userDBData.banList,
      email: userDBData.email,
      name: userDBData.name,
    }
  }
};

module.exports = getUserData;