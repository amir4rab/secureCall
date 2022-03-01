require('dotenv').config();

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {  
  cors: {    
    origin: process.env.ORIGIN, //"http://localhost:3000"// 
    methods: ["GET", "POST"]  
  },
  allowRequest: (req, callback) => {
    callback(null, req);  
  }
});

const jwt = require('jsonwebtoken');
const { MongoClient } = require("mongodb");

// importing events //
const contactRequest = require('./events/contactRequest');
const requestResponse = require('./events/requestResponse');
const callEvent = require('./events/call');
const deleteEvent = require('./events/deleteContact');
const endCallEvent = require('./events/endCallEvent');
const banEvent = require('./events/banEvent');
const unBanEvent = require('./events/unBanEvent');

// importing utils //
const getUserData = require('./utils/getUserData');
const authenticateUser = require('./utils/authenticateUser');

const activeUsers = new Map();
console.log(`Sockets.io server is live at http://localhost:${process.env.PORT}`);


io.use((socket, next) => {
  try {
    const { auth } = socket.handshake;
    userData = jwt.verify(auth.accessToken, process.env.JWT_SHARED_SECRET, { algorithms: 'HS512' });
    next();
  } catch {
    next(new Error("invalid"));
  }
});

io.on('connection', async socket => {
  //** setting up database **//
  const client = new MongoClient(process.env.MONGODB_URI);
  
  //** setting up variables **//
  const socketId = socket.id;
  const { auth } = socket.handshake;

  //** verifying users data **//
  try {
    const userData = jwt.verify(auth.accessToken, process.env.JWT_SHARED_SECRET, { algorithms: 'HS512' });

    const { userDBData, invalidUser } = await authenticateUser( userData.email, userData.secret, client );

    if ( invalidUser ) {
      console.log('disconnected');
      socket.disconnect(true);
      return;
    }

    console.log(`${auth.email} has been connected as ${socketId}!`);
    activeUsers.set(socket.id, auth.email);

    socket.emit('authenticated', {
      currentId: socket.id,
      userData: userDBData
    });

  } catch {
    console.log('disconnected');
    socket.disconnect(true);
    return;
  };

  socket.on('disconnect', _ => {
    activeUsers.delete(socket.id);
  })

  socket.on( 
    'contact request',
    ( data, callback= null ) => contactRequest( data, callback, { client, activeUsers, socket } 
  ));

  socket.on( 
    'requestResponse',
    ( data, callback= null ) => requestResponse( data, callback, { client, activeUsers, socket } 
  ));

  socket.on( 
    'call',
    ( data, callback= null ) => callEvent( data, callback, { client, activeUsers, socket } 
  ));

  socket.on( 
    'deleteContact',
    ( data, callback= null ) => deleteEvent( data, callback, { client, activeUsers, socket } 
  ));

  socket.on( 
    'callEnd',
    ( data, callback= null ) => endCallEvent( data, callback, { client, activeUsers, socket } 
  ));

  socket.on( 
    'banRequest',
    ( data, callback= null ) => banEvent( data,  callback, { client, activeUsers, socket }
  ));
  socket.on( 
    'unBanRequest',
    ( data, callback= null ) => unBanEvent( data,  callback, { client, activeUsers, socket }
  ));
});

httpServer.listen(process.env.PORT);