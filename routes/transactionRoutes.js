const express = require('express')
const {
    postCurrencyExchange,
    getCurrency,
    getCurrencyDate,
    getWallet,
    getTransactions,
    postTransactionsAdd,
} = require('../controllers/transactionController')
const router = express.Router()

router.get('/api/currency/get', getCurrency)
router.get('/api/currency/get/:date', getCurrencyDate)
router.post('/api/currency/exchange', postCurrencyExchange)
router.post('/api/transactions/add', postTransactionsAdd)
router.post('/api/transactions/get', getTransactions)
router.post('/api/wallet/get', getWallet)

module.exports = router
