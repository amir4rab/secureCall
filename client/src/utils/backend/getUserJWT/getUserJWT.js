const { MongoClient } = require("mongodb");

export const getUserJWT = async ( email ) => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const database = client.db('secureCall');
  const users = database.collection('users');
  const userData = await users.findOne({ email });
  await client.close();
  
  const websiteTokens = userData.tokens.find(token => token.name === 'website');
  return websiteTokens.signedSecret;
};

export default getUserJWT;