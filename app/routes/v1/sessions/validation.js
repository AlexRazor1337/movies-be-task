const joi = require('joi');

const createSession = joi.object({
    body: joi.object().keys({
        email: joi.string().email().required(),
        password: joi.string().required(),
    }),
});

module.exports = {
    createSession,
}
