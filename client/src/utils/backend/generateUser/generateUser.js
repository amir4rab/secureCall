import { randomBytes } from 'crypto';
const { MongoClient } = require("mongodb");
const jwt = require('jsonwebtoken');


export const generateUser = async ( user, account ) => {

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  
  const database = client.db('secureCall');
  const users = database.collection('users');

  const userData = await users.findOne({ email: user.email });
  
  const secret = randomBytes(128).toString('base64');

  const userJwt = jwt.sign(
    {
      email: user.email,
      secret
    }, 
    process.env.JWT_SHARED_SECRET,
    { algorithm: 'HS512'}
  );

  if ( userData === null ) { //** new user **//
    const doc = {
      email: user.email,
      name: user.name,
      contacts: [],
      requests: [],
      banList: [],
      currentOauthProvider: account.provider,
      acceptedProviders: [ account.provider ],
      tokens: [
        {
          name: "website",
          secret,
          signedSecret: userJwt
        }
      ],
    };

    await users.insertOne( doc );

    await client.close();
    return ({
      status: 'successful',
      reason: null 
    });
  }

  if ( !userData.acceptedProviders.includes(account.provider) ) { //** provider is not accepted by user **// 
    await client.close();
    return {
      status: 'error',
      reason: 'falseProvider' 
    };
  }

  const newTokens = userData.tokens.filter(token => token.name !== 'website');
  newTokens.push({
    secret,
    signedSecret: userJwt,
    name: 'website'
  })

  const updateDocument = { $set: { tokens: newTokens } };
    
  await users.updateOne({ email: user.email }, updateDocument);

  await client.close();
  return {
    status: 'successful',
    reason: null 
  }
};

export default generateUser;