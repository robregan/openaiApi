import React from 'react'
import '../App.css'

const Loading = () => {
  return (
    <div className='loading'>
      One Moment, Processing
      <div className='dots'>
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </div>
    </div>
  )
}

export default Loading
