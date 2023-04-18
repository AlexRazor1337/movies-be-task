const multer = require('multer')
const express = require('express');
const { StatusCodes } = require('http-status-codes')

const { validator, auth } = require('@/middleware');

const validation = require('./movies.validation');
const moviesController = require('./movies.controller');

const moviesRouter = express.Router();
moviesRouter.use(auth);

moviesRouter.post('/', validator(validation.createMovie), (req, res, next) => {
    moviesController.createMovie(req.body)
        .then((result) => res.status(StatusCodes.OK).send(result))
        .catch(next)
});

moviesRouter.delete('/:id', validator(validation.deleteMovie), (req, res, next) => {
    moviesController.deleteMovie(req.params)
        .then((result) => res.status(StatusCodes.OK).send(result))
        .catch(next)
});

moviesRouter.patch('/:id', validator(validation.updateMovie), (req, res, next) => {
    moviesController.updateMovie({ ...req.params, ...req.body})
        .then((result) => res.status(StatusCodes.OK).send(result))
        .catch(next)
});

moviesRouter.get('/:id', validator(validation.getMovie), (req, res, next) => {
    moviesController.getMovie(req.params)
        .then((result) => res.status(StatusCodes.OK).send(result))
        .catch(next)
});

moviesRouter.get('/', validator(validation.getMovies), (req, res, next) => {
    moviesController.getMovies(req.query)
        .then((result) => res.status(StatusCodes.OK).send(result))
        .catch(next)
});

moviesRouter.post('/import', multer().single('movies'), (req, res, next) => {
    moviesController.importMovies(req.file)
        .then((result) => res.status(StatusCodes.OK).send(result))
        .catch(next)
});

module.exports = moviesRouter;
