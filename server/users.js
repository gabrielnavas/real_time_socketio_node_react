const users = []

const addUser = ({ id, name, room }) => {
  room = name.trim().toLowerCase()
  name = name.trim().toLowerCase()
  const existsingUser = users.find(user => user.id === id && user.room == room && user.name === name)
  if (existsingUser) {
    return { error: 'Username is taken' }
  }
  const user = { id, name, room }
  users.push(user)
  return { user }
}

const removeUser = id => {
  const index = users.findIndex(user => user.id === id)

  if (index > -1) {
    userRemoved = users.slice(index, 1)[0]
    return userRemoved

  }
}
const getUser = id => users.find(user => user.id === id)

const getUserInRoom = (room) => users.filter(user => user.room === room)

module.exports = { addUser, removeUser, getUserInRoom, getUser }