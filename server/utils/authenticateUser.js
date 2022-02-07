const authenticateUser = async ( email= null, secret= null, client ) => {
  if ( email=== null || secret=== null ) {
    return ({ invalidUser: true, userDBData: null });
  }
  await client.connect();
  const database = client.db('secureCall');
  const users = database.collection('users');
  const userDBData = await users.findOne({ email });
  await client.close();

  let tokenIsValid = false;
  userDBData.tokens.forEach( token => {
    if ( token.secret === secret ) tokenIsValid = true;
  })

  if ( !tokenIsValid ) {
    return ({ invalidUser: true, userDBData: null });
  }

  return ({
    invalidUser: false,
    userDBData: {
      requests: userDBData.requests,
      contacts: userDBData.contacts,
      banList: userDBData.banList,
      email: userDBData.email,
      name: userDBData.name,
    }
  })
};

module.exports = authenticateUser;