const express = require('express');

const API_PREFIX = '/api';
const V1_PREFIX = `${API_PREFIX}/v1`;

const sessionsRouter = require('./v1/sessions/sessions.router');

const router = express.Router();

router.use(`${V1_PREFIX}/sessions`, sessionsRouter);

module.exports = router;
