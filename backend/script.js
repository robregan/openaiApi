import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'

config()

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.API_KEY,
  })
)

const app = express()
app.use(cors()) // Enable CORS to allow requests from your React app
app.use(express.json()) // Parse JSON request bodies

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

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
