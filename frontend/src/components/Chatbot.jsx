import React, { useState, useRef } from 'react'
import axios from 'axios'

import Loading from './Loading'

const Chat = () => {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [messages, setMessages] = useState([])

  const inputRef = useRef()

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

  function formatApiResponse(text) {
    const lines = text.split('\n')
    const formattedLines = []

    let inCodeBlock = false
    let codeSnippet = ''

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock
        if (!inCodeBlock) {
          formattedLines.push(
            <pre key={`code-${index}`} className='code-snippet'>
              {codeSnippet}
            </pre>
          )
          codeSnippet = ''
        }
        return
      }

      if (inCodeBlock) {
        codeSnippet += line + '\n'
        return
      }

      formattedLines.push(<p key={`text-${index}`}>{line}</p>)
    })

    return formattedLines
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (input.trim()) {
      setIsLoading(true)
      setMessages([...messages, { role: 'user', content: input }])
      setInput('')

      let message
      if (input.startsWith('Analyze the following code snippet:')) {
        const code = input
          .replace('Analyze the following code snippet:', '')
          .trim()
        message = await analyzeCode(code)
      } else {
        message = await sendMessage(input)
      }

      setIsLoading(false)

      if (message) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'bot', content: message },
        ])
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault()
      const current = inputRef.current
      const selection = window.getSelection()
      const range = selection.getRangeAt(0)
      const br = document.createElement('br')
      range.insertNode(br)
      range.setStartAfter(br)
      range.setEndAfter(br)
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
      return
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInputChange = () => {
    setInput(inputRef.current.innerText)
  }

  const analyzeCode = async (code) => {
    try {
      const response = await axios.post(
        'https://murmuring-lake-97708.herokuapp.com/api/analyze-code',
        {
          code,
        }
      )
      const analysis = response.data.analysis
      return analysis
    } catch (error) {
      console.error('Error analyzing code:', error)
      return null
    }
  }

  return (
    <div className='chat'>
      <div className='messages'>
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            {formatApiResponse(message.content)}
          </div>
        ))}

        {isLoading && <Loading />}
      </div>
      <form onSubmit={handleSubmit} className='message-form'>
        <div
          className='input-box'
          contentEditable
          ref={inputRef}
          onKeyDown={handleKeyDown}
          onInput={handleInputChange}
          placeholder='Ask me anything...'
        />

        <button type='submit'>Send It</button>
      </form>
    </div>
  )
}

export default Chat
