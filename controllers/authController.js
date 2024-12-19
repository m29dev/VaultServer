const User = require('../models/UserModel')

// Function to handle exchange rate requests
exports.postSignIn = async (req, res) => {
    const { login, password } = req.body

    try {
        console.log('postSignIn', login, password)

        const user = await User.findOne({ username: login })

        if (!user) {
            console.log({ error: 'username or password error' })
            return res.status(400).json({ error: 'username or password error' })
        }

        if (user?.password !== password) {
            console.log({ error: 'username or password error' })
            return res.status(400).json({ error: 'username or password error' })
        }

        res.json({ username: user?.username, _id: user?._id })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.postSignUp = (req, res) => {
    const { login, password } = req.body

    try {
        console.log('postSignUp', login, password)

        const createUser = async () => {
            try {
                const user = new User({
                    username: login,
                    password,
                    wallet: [
                        {
                            currency: 'złoty',
                            code: 'PLN',
                            amount: 0,
                        },
                    ],
                })
                const result = await user.save()
                console.log('User created:', result)

                res.json({ username: result?.username, _id: result?._id })
            } catch (error) {
                console.error('Error creating user:', error)

                res.status(400).json({ error: 'postSignUp' })
            }
        }

        createUser()
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
