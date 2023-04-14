const Joi = require('joi');

const createSession = Joi.object({
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),
});

module.exports = {
    createSession,
}
