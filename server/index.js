const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const router = require('./route');

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: "*", } });

app.use(cors());
app.use(router);

io.on('connection', socket => {
  console.log('We have a new connection')

  socket.on('disconnect', () => {
    console.log('User had left!!!')
  })
})


server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));
