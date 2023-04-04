import React, { useState } from 'react'
import axios from 'axios'

import Loading from './Loading'

const Chat = () => {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [messages, setMessages] = useState([])

  const sendMessage = async (userInput) => {
    try {
      const response = await axios.post(
        'https://murmuring-lake-97708.herokuapp.com/api/chat',
        {
          input: userInput,
        }
      )
      const message = response.data.message
      return message
    } catch (error) {
      console.error('Error sending message:', error)
      return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (input.trim()) {
      setIsLoading(true)
      setMessages([...messages, { role: 'user', content: input }])
      setInput('')

      const message = await sendMessage(input)
      setIsLoading(false)

      if (message) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'bot', content: message },
        ])
      }
    }
  }

  return (
    <div className='chat'>
      <div className='messages'>
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            {message.content}
          </div>
        ))}
        {isLoading && <Loading />}
      </div>
      <form onSubmit={handleSubmit} className='message-form'>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Ask me anything!'
        />
        <button type='submit'>Send It</button>
      </form>
    </div>
  )
}

export default Chat
