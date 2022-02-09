const validator = require('validator');

const isEmailValid = async ( recipientEmail, callback = null ) => {
  try {
    if( typeof recipientEmail !== 'string' ) return false;
    console.log(recipientEmail);
    const recipientEmailIsValid = validator.isEmail(recipientEmail);
    if ( !recipientEmailIsValid ) {
      await client.close()
      callback && callback({
          recipientEmail,
          status: 'error',
          response: 'Invalid Email address!',
          responseCode: 'invalidInput'
      });
      return false;
    }
    return true;
  } catch(err) {
    console.error(err);
    return false;
  }
}

module.exports = isEmailValid;
