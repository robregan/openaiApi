import React from 'react'
import './App.css'
import Chat from './components/Chatbot'

function App() {
  return (
    <div className='App'>
      <header>
        <h1>Rob-ot 2.0 Chatbot</h1>
      </header>
      <div className='container'>
        <Chat />
      </div>
    </div>
  )
}

export default App
