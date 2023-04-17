const Joi = require('joi');

const fullMovieBody = Joi.object({
    title: Joi.string().required(),
    year: Joi.number().integer().required(),
    format: Joi.string().valid('DVD', 'VHS', 'Blu-Ray').required(),
    actors: Joi.array().items(Joi.string()).required(),
});

const createMovie = Joi.object({
    body: fullMovieBody,
});

const deleteMovie = Joi.object({
    params: Joi.object({
        id: Joi.number().integer().required(),
    }),
});

const updateMovie = Joi.object({
    params: Joi.object({
        id: Joi.number().integer().required(),
    }),
    body: fullMovieBody,
});

const getMovie = Joi.object({
    params: Joi.object({
        id: Joi.number().integer().required(),
    }),
});

const getMovies = Joi.object({
    query: Joi.object({
        title: Joi.string(),
        actor: Joi.string(),
        search: Joi.string(),
        sort: Joi.string().valid('id', 'title', 'year'),
        order: Joi.string().valid('ASC', 'DESC'),
        limit: Joi.number().integer(),
        offset: Joi.number().integer(),
    }),
});

module.exports = {
    createMovie,
    deleteMovie,
    updateMovie,
    getMovie,
    getMovies,
};
