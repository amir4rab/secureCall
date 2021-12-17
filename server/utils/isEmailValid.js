const validator = require('validator');

const isEmailValid = async ( recipientEmail, callback ) => {
  const recipientEmailIsValid = validator.isEmail(recipientEmail);
  if ( !recipientEmailIsValid ) {
    await client.close();
    try {
      callback({
        recipientEmail,
        status: 'error',
        response: 'Invalid Email address!',
        responseCode: 'invalidInput'
      });
    } catch {};
    return false;
  }
  return true;
}

module.exports = isEmailValid;
