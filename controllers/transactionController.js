const axios = require('axios')
const Transaction = require('../models/TransactionModel')
const User = require('../models/UserModel')

exports.getCurrency = async (req, res) => {
    try {
        // get all currencies
        const url = 'https://api.nbp.pl/api/exchangerates/tables/a/'
        const response = await axios.get(url)
        const data = response?.data

        const plnObject = {
            code: 'PLN',
            currency: 'złoty',
            mid: 1,
        }

        console.log(data)
        data[0].rates.push(plnObject)

        res.json(data)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.postTransactionsAdd = async (req, res) => {
    // CHANGE LATER FOR VALUES IN URL /CURRENCY/NEW/AMOUNT

    const { amount, userId } = req.body
    console.log('postTransactionsAdd', amount, userId)

    try {
        const createTransactionAdd = async () => {
            try {
                // const item = new Transaction({
                //     userId,
                //     currentCurrency: currentCurrencyObject,
                //     newCurrency: newCurrencyObject,
                //     date: Date(),
                // })
                // const result = await item.save()
                // console.log('Transaction created:', result)

                const user = await User.findById(userId)
                console.log(46, user)

                user.wallet.forEach((item) => {
                    if (item.code === 'PLN') {
                        return (item.amount = +item.amount + +amount)
                    }
                })

                const newWallet = user.wallet

                const updatedUser = await User.findByIdAndUpdate(
                    userId, // The ID of the document to update
                    {
                        wallet: newWallet,
                    }, // The new value for the 'amount' field
                    { new: true } // Option to return the updated document instead of the original
                )

                console.log('UPDATED: ', updatedUser)
                res.json(updatedUser)
            } catch (error) {
                console.error('Error creating user:', error)

                res.status(400).json({ error: 'postCurrencyExchange' })
            }
        }

        createTransactionAdd()
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message })
    }
}

exports.postCurrencyExchange = async (req, res) => {
    // CHANGE LATER FOR VALUES IN URL /CURRENCY/NEW/AMOUNT

    const { currentCurrency, newCurrency, amount, userId } = req.body
    console.log(
        'postCurrencyExchange',
        currentCurrency,
        newCurrency,
        amount,
        userId
    )

    try {
        let currentCurrencyRate
        if (currentCurrency === 'PLN') {
            currentCurrencyRate = 1
        } else {
            const url0 = `https://api.nbp.pl/api/exchangerates/rates/a/${currentCurrency}/`
            const response0 = await axios.get(url0)
            const currentCurrencyData = response0?.data
            currentCurrencyRate = currentCurrencyData?.rates?.[0]?.mid
            console.log(currentCurrencyRate)
        }

        let newCurrencyRate
        if (newCurrency === 'PLN') {
            newCurrencyRate = 1
        } else {
            const url1 = `https://api.nbp.pl/api/exchangerates/rates/a/${newCurrency}/`
            const response1 = await axios.get(url1)
            const newCurrencyData = response1?.data
            newCurrencyRate = newCurrencyData?.rates?.[0]?.mid
            console.log(newCurrencyRate)
        }

        const exchange = (+amount * +currentCurrencyRate) / +newCurrencyRate
        console.log(amount, currentCurrency, ' => ', exchange, newCurrency)
        const rounded = Math.round(exchange * 100) / 100

        const currentCurrencyObject = {
            currency: currentCurrency,
            amount: amount,
        }

        const newCurrencyObject = {
            currency: newCurrency,
            amount: rounded,
        }

        const createTransaction = async () => {
            try {
                const item = new Transaction({
                    userId,
                    currentCurrency: currentCurrencyObject,
                    newCurrency: newCurrencyObject,
                    date: Date(),
                })
                const result = await item.save()
                console.log('Transaction created:', result)

                res.json(result)
            } catch (error) {
                console.error('Error creating user:', error)

                res.status(400).json({ error: 'postCurrencyExchange' })
            }
        }

        createTransaction()
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message })
    }
}

exports.getTransactions = async (req, res) => {
    try {
        const { userId } = req.body

        console.log(
            'getTransactions: search for transactions of userId ',
            userId
        )

        const transactions = await Transaction.find({ userId })
        console.log(transactions)
        res.json(transactions)
    } catch (err) {
        console.log(err)
    }
}

exports.getWallet = async (req, res) => {
    try {
        const { userId } = req.body
        console.log('getWallet: search for userId ', userId)

        const user = await User.findById(userId)

        console.log(user)
        if (!user?.wallet) return res.status(400).json({ error: '404' })
        res.json(user?.wallet)
    } catch (err) {
        console.log(err)
    }
}