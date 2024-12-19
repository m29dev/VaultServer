const express = require('express')
const authRoutes = require('./routes/authRoutes')
const transactionRoutes = require('./routes/transactionRoutes')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = 3000
app.use(cors())

const mongoose = require('mongoose')

// MongoDB connection string
const uri = process.env.DB_URI

mongoose
    .connect(uri)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error)
    })

// Middleware
app.use(bodyParser.json())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('VaultServer')
})

// Routes
app.use(authRoutes)
app.use(transactionRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
