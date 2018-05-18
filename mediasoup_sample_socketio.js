//
// mediasoup_sample
//   https://github.com/mganeko/mediasoup_sample
//   mediasoup_sample is provided under MIT license
//
//   This sample is using https://github.com/versatica/mediasoup
//

'use strict';


const express = require('express');
const app = express();
const webPort = 3000;
app.use(express.static('public'));
const webServer = app.listen(webPort, function(){
    console.log('Web server start. http://localhost:' + webServer.address().port + '/');
});

let Connections = new Array();
let Peers = new Array();
// --- socket.io server ---
const io = require('socket.io')(webServer);

io.on('connection', function(socket) {
  console.log('client connected. socket id=' + socket.id);
  Connections[socket.id] = socket

  if(Object.keys(Connections).length > 1){
    for(var socketId in Connections){
      console.log('emit startLive')
      Connections[socketId].emit('startLive')
    }
  }

  socket.on('disconnect', function() {
    // close user connection
    console.log('Socket disconnected')
    delete Connections[socket.id]
  });
  socket.on('error',  function(err) {
    console.error('socket ERROR:', err);
  });
  socket.on('message', function (message) {
    for(var socketId in Connections){
      Connections[socketId].emit('message', {
        from: socket.id,
        message: message
      })
    }
  });
  socket.emit('connected', socket.id)
});