const mongoose = require('mongoose')

// Define a schema
const transactionSchema = new mongoose.Schema({
    id: { type: String, required: false },
    userId: { type: String, required: true },
    currentCurrency: { type: Object, required: true },
    newCurrency: { type: Object, required: true },
    date: { type: Date, required: true },
})

// Create a model
const Transaction = mongoose.model('Transaction', transactionSchema)
module.exports = Transaction
