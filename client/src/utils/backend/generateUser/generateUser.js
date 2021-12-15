import { randomBytes } from 'crypto';
const { MongoClient } = require("mongodb");
const jwt = require('jsonwebtoken');


export const generateUser = async ( user ) => {
  const client = new MongoClient(process.env.MONGODB_URI);

  await client.connect();
  
  const database = client.db('secureCall');
  const users = database.collection('users');

  const secret = randomBytes(128).toString('base64');

  const userJwt = jwt.sign(
    {
      email: user.email,
      secret
    }, 
    process.env.JWT_SHARED_SECRET,
    { algorithm: 'HS512'}
  );

  const query = {
    email: user.email
  }
  const userData = await users.findOne(query);

  console.log(userData);
    
  if ( userData === null ) { //** new user **//
    const doc = {
      email: user.email,
      name: user.name,
      contacts: [],
      requests: [],
      secret,
      signedSecret: userJwt
    };
  
    const newData = { $set: doc };

    await users.updateOne( query, newData );
  } else {
    const doc = {
      secret,
      signedSecret: userJwt
    }

    const newData = { $set: doc };
    
    await users.updateOne( query, newData );
  }

  await client.close();
};

export default generateUser;