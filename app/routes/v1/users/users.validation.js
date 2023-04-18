const Joi = require('joi');

const createUser = Joi.object({
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
        .messages({ 'any.only': 'Passwords do not match' }),

        name: Joi.string().required(),
    }),
});

module.exports = {
    createUser,
}
