const { StatusCodes } = require('http-status-codes')
const User = require('@/models/user')

const createUser = async (req, res) => {
    const { name, email, password } = req.body

    const user = await User.create({
        name,
        email,
        password,
    });

    return {
        message: 'User created successfully',
        user,
    };
}

module.exports = {
    createUser,
}
