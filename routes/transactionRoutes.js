const express = require('express')
const {
    postCurrencyExchange,
    getCurrency,
    getWallet,
    getTransactions,
    postTransactionsAdd,
} = require('../controllers/transactionController')
const router = express.Router()

router.get('/api/currency/get', getCurrency)
router.post('/api/currency/exchange', postCurrencyExchange)
router.post('/api/transactions/add', postTransactionsAdd)
router.post('/api/transactions/get', getTransactions)
router.post('/api/wallet/get', getWallet)

module.exports = router
