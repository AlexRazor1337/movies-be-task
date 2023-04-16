const User = require('@/models/user')
const bcrypt = require('bcryptjs')
const { createSession } = require('../sessions/sessions.controller')

const createUser = async ({ name, email, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return {
                status: 0,
                error: {
                    fields: {
                        email: 'NOT_UNIQUE'
                    },
                },
                code: 'EMAIL_NOT_UNIQUE',
            };
        }
    }

    return createSession({ email, password })
}

module.exports = {
    createUser,
}
