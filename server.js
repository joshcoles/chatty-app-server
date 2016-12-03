const express = require('express');
const SocketServer = require('ws').Server;
const uuid = require('node-uuid');
const PORT = 4000;
const server = express()

// serving static assets from public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));


// Create the WebSockets server
const wss = new SocketServer({ server });


  wss.on('connection', (ws) => {

// ==========================================================
// keeping track of number of users online
// ==========================================================

  let numberOfUsersOnline = {
    type: "numberOfUsersOnline",
    numberOfUsersOnline: wss.clients.length
  }

  console.log("Number of users online is: ", numberOfUsersOnline.numberOfUsersOnline)

  let stringedNumberOfUsersOnline = JSON.stringify(numberOfUsersOnline);

  wss.clients.forEach(function each(client) {
    client.send(stringedNumberOfUsersOnline);
  });


// ==========================================================
// When server receives a new message,
// parse message then do something with it
// ==========================================================


  ws.on('message', function (msg) {
    let parsedMessage = JSON.parse(msg)

// ==========================================================
// for new message posts, give it an incomingMessage type,
// a unique UUID, stringify it and send it back to every
// client to be handled.
// ==========================================================

    if (parsedMessage.type === "postMessage") {

      let parsedNewData = {
        id: uuid.v4(parsedMessage.id),
        content: parsedMessage.content,
        username: parsedMessage.username,
        type: "incomingMessage"
      }

      let stringedParsedNewData = JSON.stringify(parsedNewData)
      wss.clients.forEach(function each(client) {
        client.send(stringedParsedNewData);
      });

// ==========================================================
// for name update messages, stringify the message
// and send it back to client do be handled.
// ==========================================================

    } else if (parsedMessage.type === "nameUpdate") {

      let stringedParsedNewData = JSON.stringify(parsedMessage)
      wss.clients.forEach(function each(client) {
        client.send(stringedParsedNewData);
      });
    }
  });
  ws.on('close', () => {

// ==========================================================
// updating number of users online when connection is closed
// ==========================================================
    console.log('Client disconnected');
    numberOfUsersOnline.numberOfUsersOnline = numberOfUsersOnline.numberOfUsersOnline - 1;
    console.log("Number of users online is: ", numberOfUsersOnline.numberOfUsersOnline)

    wss.clients.forEach(function each(client) {
    client.send(stringedNumberOfUsersOnline);
  });

  });
});

