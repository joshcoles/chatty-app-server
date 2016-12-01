const express = require('express');
const SocketServer = require('ws').Server;
const uuid = require('node-uuid');

// Set the port to 4000
const PORT = 4000;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });






wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', function (msg) {
    let parsedMessage = JSON.parse(msg)

    let parseNewData = {
      id: uuid.v4(parsedMessage.id),
      content: parsedMessage.content,
      username: parsedMessage.username
    }
    console.log(uuid.v4(parsedMessage.id));
    let stringedParseNewData = JSON.stringify(parseNewData)
    wss.clients.forEach(function each(client) {
      console.log("what I'm looking for:" + stringedParseNewData);
      client.send(stringedParseNewData);
    });

  });


  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => console.log('Client disconnected'));
});

