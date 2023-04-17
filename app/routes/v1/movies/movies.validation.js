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

module.exports = {
    createMovie,
    deleteMovie,
    updateMovie,
    getMovie,
};
