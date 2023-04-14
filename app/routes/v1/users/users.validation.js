const Joi = require('joi');

const createUser = Joi.object({
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
        name: Joi.string().required()
    }),
});

module.exports = {
    createUser,
}
