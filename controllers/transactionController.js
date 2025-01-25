const axios = require('axios')
const Transaction = require('../models/TransactionModel')
const User = require('../models/UserModel')

exports.getCurrency = async (req, res) => {
    try {
        // get all currencies
        const url = 'https://api.nbp.pl/api/exchangerates/tables/c/'
        const response = await axios.get(url)
        const data = response?.data
        res.json(data)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.getCurrencyDate = async (req, res) => {
    try {
        const { date } = req.params
        console.log(date)

        // get all currencies
        const url = `https://api.nbp.pl/api/exchangerates/tables/c/${date}`
        const response = await axios.get(url)
        console.log(response)

        const data = response?.data

        res.json(data)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.postTransactionsAdd = async (req, res) => {
    const { amount, userId } = req.body
    console.log('postTransactionsAdd', amount, userId)

    try {
        const createTransactionAdd = async () => {
            try {
                const user = await User.findById(userId)
                console.log(46, user)

                user.wallet.forEach((item) => {
                    if (item.code === 'PLN') {
                        return (item.amount = +item.amount + +amount)
                    }
                })

                const newWallet = user.wallet

                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    {
                        wallet: newWallet,
                    },
                    { new: true }
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

    let currentCurrencyInfo = {}
    let newCurrencyInfo = {}

    try {
        // EXCHANGE FROM PLN TO _
        // KANTOR SELLS
        // USER BUYS
        if (currentCurrency === 'PLN') {
            console.log('WYMIEN ', amount, 'PLN =>', newCurrency)

            const plnAmount = amount

            const url0 = `https://api.nbp.pl/api/exchangerates/rates/c/${newCurrency}/`
            const response0 = await axios.get(url0)
            const newCurrencyData = response0?.data

            console.log('INFO: ', newCurrencyData)
            const buyRate = newCurrencyData?.rates?.[0]?.ask

            const newAmount = +plnAmount / +buyRate

            // PLN INFO
            currentCurrencyInfo = {
                currency: 'zloty',
                code: currentCurrency,
                amount: amount,
            }

            newCurrencyInfo = {
                currency: newCurrencyData?.currency,
                code: newCurrencyData?.code,
                amount: newAmount,
            }

            console.log(
                'WYMIANA WYKONANA: ',
                currentCurrencyInfo,
                newCurrencyInfo
            )
        }

        // EXCHANGE FROM _ TO PLN
        // KANTOR BUYS
        // USER SELLS
        if (newCurrency === 'PLN') {
            console.log('WYMIEN ', amount, currentCurrency, ' =>', newCurrency)

            const plnAmount = amount

            const url0 = `https://api.nbp.pl/api/exchangerates/rates/c/${currentCurrency}/`
            const response0 = await axios.get(url0)
            const currentCurrencyData = response0?.data

            console.log('INFO: ', currentCurrencyData)
            const sellRate = currentCurrencyData?.rates?.[0]?.bid

            const newAmount = +plnAmount * +sellRate

            currentCurrencyInfo = {
                currency: currentCurrencyData?.currency,
                code: currentCurrencyData?.code,
                amount: amount,
            }

            // PLN INFO
            newCurrencyInfo = {
                currency: 'zloty',
                code: newCurrency,
                amount: newAmount,
            }

            console.log(
                'WYMIANA WYKONANA: ',
                currentCurrencyInfo,
                newCurrencyInfo
            )
        }

        const createTransaction = async () => {
            try {
                const item = new Transaction({
                    userId,
                    currentCurrency: currentCurrencyInfo,
                    newCurrency: newCurrencyInfo,
                    date: Date(),
                })
                const result = await item.save()

                console.log('Transaction created:', result)
                if (!result)
                    return res
                        .status(400)
                        .json({ error: 'postCurrencyExchange' })
            } catch (error) {
                console.error('Error creating user:', error)

                res.status(400).json({ error: 'postCurrencyExchange' })
            }
        }
        createTransaction()

        const updateWallet = async () => {
            try {
                const user = await User.findById(userId)

                // current currency
                user.wallet.forEach((item) => {
                    if (item.code === currentCurrencyInfo.code) {
                        return (item.amount =
                            +item.amount - +currentCurrencyInfo.amount)
                    }
                })

                // new currency
                let isCurrency = false
                user.wallet.forEach((item) => {
                    if (item.code === newCurrencyInfo.code) {
                        item.amount = +item.amount + +newCurrencyInfo.amount
                        isCurrency = true
                        return
                    }
                })

                // if new !currency create it
                if (!isCurrency) {
                    user.wallet.push({
                        currency: newCurrencyInfo?.currency,
                        code: newCurrencyInfo?.code,
                        amount: newCurrencyInfo?.amount,
                    })
                }

                const newWallet = user.wallet

                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    {
                        wallet: newWallet,
                    },
                    { new: true }
                )

                console.log('UPDATED: ', updatedUser)

                if (!updatedUser)
                    return res
                        .status(400)
                        .json({ error: 'postCurrencyExchange' })
            } catch (error) {
                console.error('Error creating user:', error)

                res.status(400).json({ error: 'postCurrencyExchange' })
            }
        }
        updateWallet()

        res.json(newCurrencyInfo)
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

        const transactions = await Transaction.find({ userId }).sort({
            date: -1,
        })
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
