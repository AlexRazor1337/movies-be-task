const { StatusCodes } = require('http-status-codes');

const errorHandler = (error, req, res, next) => {
    const status = error.status || StatusCodes.BAD_REQUEST;
    res.status(status).send({ error: error.message })
}

module.exports = errorHandler;
