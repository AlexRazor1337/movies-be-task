const { StatusCodes } = require('http-status-codes')
const express = require('express');

const { validator } = require('@/middleware');

const validation = require('./users.validation');
const usersController = require('./users.controller');

const usersRouter = express.Router();

usersRouter.post('/', validator(validation.createUser), (req, res, next) =>
    usersController
        .createUser(req)
        .then((result) => res.status(StatusCodes.CREATED).send(result))
        .catch(next)
  );

module.exports = usersRouter;
