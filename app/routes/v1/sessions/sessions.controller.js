const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const User = require('@/models/user')

const createSession = async ({ email, password }) => {
    const error = {
        status: 0,
        error: {
            fields: {
                email: 'AUTHENTICATION_FAILED',
                password: 'AUTHENTICATION_FAILED',
            },
            code: 'AUTHENTICATION_FAILED',
        },
    };

    const user = await User.findOne({
        where: {
            email,
        },
        raw: true,
    });
    if (!user) return error;
    
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return error;

    delete user.password;
    const token = jwt.sign(user, process.env.JWT_SECRET)

    return {
        token,
        status: 1,
    };
}

module.exports = {
    createSession,
}
