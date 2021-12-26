const validator = require('validator');

const isEmailValid = async ( recipientEmail, callback = null ) => {
  const recipientEmailIsValid = validator.isEmail(recipientEmail);
  if ( !recipientEmailIsValid ) {
    await client.close();
    try {
      if ( callback !== null ) {
        callback({
          recipientEmail,
          status: 'error',
          response: 'Invalid Email address!',
          responseCode: 'invalidInput'
        });
      }
    } catch {};
    return false;
  }
  return true;
}

module.exports = isEmailValid;
