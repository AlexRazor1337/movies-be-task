const express = require('express');

const { validator } = require('@/middleware');

const validation = require('./users.validation');
const usersController = require('./users.controller');

const usersRouter = express.Router();

usersRouter.post('/', validator(validation.createUser), usersController.createUser);

module.exports = usersRouter;
