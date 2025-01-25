const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    id: { type: String, required: false },
    username: { type: String, required: true },
    password: { type: String, required: true },
    wallet: { type: Array, required: true },
})

const User = mongoose.model('User', userSchema)
module.exports = User
