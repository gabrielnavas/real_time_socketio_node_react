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

const socketConstantsEmit = {
  MESSAGE: 'message',
  ROOM_DATA: 'roomData'
}

const socketOn = {
  JOIN: 'join',
  SEND_MESSAGE: 'sendMessage',
  DISCONNECT: 'disconnect'
}

io.on('connection', socket => {
  socket.on(socketOn.JOIN, ({ name, room }, callback) => {
    const id = socket.id
    const { error, user } = addUser({ id, name, room })
    if (error) {
      return callback(error)
    }
    socket.emit(socketConstantsEmit.MESSAGE, { user: 'admin', text: `${user.name} welcome to the room ${user.room}` })
    socket.broadcast.to(user.room).emit(socketConstantsEmit.MESSAGE, { user: 'admin', text: `${user.name}, has joined!` })
    socket.join(user.room)
    io.to(user.room).emit(socketConstantsEmit.ROOM_DATA, { room: user.room, users: getUserInRoom(user.room) })
    callback()
  })

  socket.on(socketOn.SEND_MESSAGE, (message, callback) => {
    const user = getUser(socket.id)
    io.to(user.room).emit(socketConstantsEmit.MESSAGE, { user: user.name, text: message.text })
    io.to(user.room).emit(socketConstantsEmit.ROOM_DATA, { room: user.room, users: getUserInRoom(user.room) })
    callback()
  })

  socket.on(socketOn.DISCONNECT, () => {
    const user = removeUser(socket.id)

    if (user) {
      console.log(user)
      io.to(user.room).emit(socketConstantsEmit.MESSAGE, { user: 'admin', text: `${user.name} has left.` })
    }
    console.log('User had left!!!')
  })
})


server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));
