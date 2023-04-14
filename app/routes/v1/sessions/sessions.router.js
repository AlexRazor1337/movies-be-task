const express = require('express');

const { validator } = require('@/middleware');

const validation = require('./validation');
const sessionsController = require('./sessions.controller');

const sessionsRouter = express.Router();

sessionsRouter.post('/', validator(validation.createSession), sessionsController.createSession);

module.exports = sessionsRouter;
