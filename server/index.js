const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const router = require('./route');

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: "*", } });

const { removeUser, addUser, getUser, getUserInRoom } = require('./users')

app.use(cors());
app.use(router);

io.on('connection', socket => {
  socket.on('join', ({ name, room }, callback) => {
    const id = socket.id
    const { error, user } = addUser({ id, name, room })
    if(error) {
      return callback(error)
    }
    socket.emit('message', {user: 'admin', text: `${user.name} welcome to the room ${user.room}`})
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined!`})
    socket.join(user.room)
    callback()
  })

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id)
    io.to(user.room).emit('message', {user: user.name, text:message.text})
    callback()
  })

  socket.on('disconnect', () => {
    console.log('User had left!!!')
  })
})


server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));
