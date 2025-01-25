const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    id: { type: String, required: false },
    userId: { type: String, required: true },
    currentCurrency: { type: Object, required: true },
    newCurrency: { type: Object, required: true },
    date: { type: Date, required: true },
})

const Transaction = mongoose.model('Transaction', transactionSchema)
module.exports = Transaction
