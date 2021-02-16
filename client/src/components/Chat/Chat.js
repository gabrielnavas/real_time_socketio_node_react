import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'

import './Chat.css'
import InfoBar from '../../components/InfoBar/InforBar'
import TextContainer from '../../components/TextContainer/TextContainer'
import Input from '../Input/Input'
import Messages from '../Messages/Messages'

let socket

const Chat = (props) => {

  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const ENDPOINT = 'localhost:5000'

  useEffect(() => {
    const { name, room } = queryString.parse(props.location.search)
    socket = io(ENDPOINT)
    setName(name)
    setRoom(room)
    socket.emit('join', { name, room }, () => { })
    return () => {
      socket.emit('disconnect')
      socket.off()
    }
  }, [ENDPOINT, props.location.search])

  useEffect(() => {
    socket.on('message', message => {
      setMessages([...messages, message])
    })
  }, [messages])

  useEffect(() => {
    socket.on('roomData', ({ room, users }) => {
      setUsers(users)
    })
  }, [users])

  const sendMessage = (event) => {
    event.preventDefault()
    console.log(message)
    if (message) {
      socket.emit('sendMessage', {name, text:message}, () => setMessage(''))
    }
  }

  return (
    <div className='outerContainer'>
      <div className='container'>
        <InfoBar roomName={room} />
        <Messages messages={messages} name={name}/>
        <Input 
          message={message} 
          setMessage={setMessage} 
          sendMessage={sendMessage} 
        />
      </div>
      <TextContainer users={users} />
    </div>
  )
}

export default Chat