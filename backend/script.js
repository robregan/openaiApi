import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'

import path from 'path'

// ... (your existing server setup)

config()

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.API_KEY,
  })
)

const app = express()
app.use(cors()) // Enable CORS to allow requests from your React app
app.use(express.json()) // Parse JSON request bodies
if (process.env.NODE_ENV === 'production') {
  // Set the static folder
  app.use(express.static('frontend/build'))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

app.post('/api/chat', async (req, res) => {
  const { input } = req.body
  try {
    const apiResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: input }],
    })
    const message = apiResponse.data.choices[0].message.content
    res.json({ message })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/analyze-code', async (req, res) => {
  const { code } = req.body
  try {
    const apiResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Analyze the following code snippet:\n${code}`,
        },
      ],
    })
    const analysis = apiResponse.data.choices[0].message.content
    res.json({ analysis })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
