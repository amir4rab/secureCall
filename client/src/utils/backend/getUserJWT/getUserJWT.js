const { MongoClient } = require("mongodb");

export const getUserJWT = async ( email ) => {
  const client = new MongoClient(process.env.MONGODB_URI);
      
  await client.connect();
  
  const database = client.db('secureCall');
  const users = database.collection('users');
  
  const doc = {
    email
  };
  const userData = await users.findOne(doc);

  await client.close();

  return userData.signedSecret;
};

export default getUserJWT;