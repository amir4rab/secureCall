const getIdFromEmail = ( email, activeUsers ) => {
  const entries = [...activeUsers.entries()];
  let i = 0;
  let socketId = null;
  while ( i < entries.length ) {
    if( entries[i][1] === email ) {
      socketId = entries[i][0];
      break;
    }
    i += 1;
  }
  return socketId;
};

module.exports = getIdFromEmail;

