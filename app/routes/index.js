const express = require('express');

const API_PREFIX = '/api';
const V1_PREFIX = `${API_PREFIX}/v1`;

const sessionsRouter = require('./v1/sessions/sessions.router');
const usersRouter = require('./v1/users/users.router');

const router = express.Router();

router.use(`${V1_PREFIX}/sessions`, sessionsRouter);
router.use(`${V1_PREFIX}/users`, usersRouter);

module.exports = router;
