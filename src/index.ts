import express from 'express'
import route from './routes/user.route'

const app = express()
const PORT = 8080

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  next()
})
app.use(express.json())
app.use(route)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
