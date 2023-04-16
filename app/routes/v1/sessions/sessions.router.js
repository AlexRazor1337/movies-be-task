const express = require('express');
const { StatusCodes } = require('http-status-codes')

const { validator } = require('@/middleware');

const validation = require('./sessions.validation');
const sessionsController = require('./sessions.controller');

const sessionsRouter = express.Router();

sessionsRouter.post('/', validator(validation.createSession), (req, res, next) => {
    sessionsController.createSession(req.body)
        .then((result) => res.status(StatusCodes.OK).send(result))
        .catch(next)
});

module.exports = sessionsRouter;
