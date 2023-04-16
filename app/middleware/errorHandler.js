const { StatusCodes } = require('http-status-codes');

const errorHandler = (error, req, res, next) => {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    console.log(error);
    res.status(status).send({ error: error.message, status: 0 })
}

module.exports = errorHandler;
