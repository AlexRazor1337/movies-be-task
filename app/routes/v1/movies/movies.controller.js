const sequelize = require('@/db');
const { Op } = require('sequelize');
const Movie = require('@/models/movie');
const Actor = require('@/models/actor');
const ActorMovie = require('@/models/actorMovie');

const createMovie = async ({title, year, format, actors}) => {
    const transaction = await sequelize.transaction(); // Used because of "SQLITE_BUSY: database is locked" error

    const movieActors = await Promise.all(actors.map((actorName) => {
        return Actor.findOrCreate({
            where: {
                name: actorName,
            },
            transaction,
        })
    })).then((act) => act.map((actor) => actor[0]));

    await transaction.commit();

    let movie;

    try {
        movie = await Movie.create({
            title,
            year,
            format,
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return {
                status: 0,
                error: {
                    fields: {
                        title: 'NOT_UNIQUE'
                    },
                    code: 'MOVIE_EXISTS'
                }
            }
        }
    }

    await movie.setActors(movieActors);

    return {
        status: 1,
        data: {
            ...movie.get(),
            actors: movieActors,
        },
    };
}

const deleteMovie = async ({ id }) => {
    id = parseInt(id);

    const movie = await Movie.findOne({
        where: {
            id,
        },
        include: {
            model: Actor,
            as: 'actors',
            through: { attributes: [] }
        },
    });

    if (!movie) {
        return {
            status: 0,
            error: {
                fields: {
                    id,
                },
                code: 'MOVIE_NOT_FOUND',
            }
        }
    }

    await movie.destroy();

    await Promise.all(movie.actors.map((actor) => {
        return ActorMovie.count({
            where: {
                actorId: actor.id,
            },
        }).then((count) => {
            if (count === 0) actor.destroy()
        });
    }));

    return {
        status: 1,
    }
}

const updateMovie = async ({ id, title, year, format, actors }) => {
    id = parseInt(id);

    const movie = await Movie.findOne({
        where: {
            id,
        },
    });

    const prevActors = await movie.getActors();

    movie.update({
        title,
        year,
        format,
    });

    if (!movie) {
        return {
            status: 0,
            error: {
                fields: {
                    id,
                },
                code: 'MOVIE_NOT_FOUND',
            }
        }
    }

    const transaction = await sequelize.transaction();

    const movieActors = await Promise.all(actors.map((actorName) => {
        return Actor.findOrCreate({
            where: {
                name: actorName,
            },
            transaction,
        })
    })).then((act) => act.map((actor) => actor[0]));

    await transaction.commit();

    await movie.setActors(movieActors);

    // Get all actors that are not in the movie anymore
    await Promise.all(prevActors.filter((actor) => !actors.includes(actor.name))
    .map((actor) => {
        return ActorMovie.count({
            where: {
                actorId: actor.id,
            },
        }).then((count) => {
            if (count === 0) actor.destroy()
        });
    }));

    return {
        status: 1,
        data: {
            ...movie.get(),
            actors: movieActors,
        },
    };
}

const getMovie = async ({ id }) => {
    id = parseInt(id);

    const movie = await Movie.findOne({
        where: {
            id,
        },
        include: {
            model: Actor,
            as: 'actors',
            through: { attributes: [] }
        },
    });

    if (!movie) {
        return {
            status: 0,
            error: {
                fields: {
                    id,
                },
                code: 'MOVIE_NOT_FOUND',
            }
        }
    }

    return {
        status: 1,
        data: movie,
    }
}


const getMovies = async ({ title, actor, search, sort = 'id', order = 'ASC', limit = 20, offset = 0 }) => {
    const where = {};

    if (title) {
        where.title = {
            [Op.like]: `%${title}%`,
        }
    }

    if (actor) {
        where['$actors.name$'] = {
            [Op.like]: `%${actor}%`,
        }
    }

    if (search) {
        where[Op.or] = [
            {
                title: {
                    [Op.like]: `%${search}%`,
                }
            },
            {
                '$actors.name$': {
                    [Op.like]: `%${search}%`,
                }
            },
        ]
    }

    const { count: total, rows: data } = await Movie.findAndCountAll({
        where,
        include: {
            model: Actor,
            as: 'actors',
            through: { attributes: [] },
            attributes: [],
        },
        order: [
            [[sort, order]],
        ],
        limit,
        offset,
        subQuery: false,
        distinct: true,
    });

    return {
        status: 1,
        data,
        meta: {
            total,
        }
    }
}

module.exports = {
    createMovie,
    deleteMovie,
    updateMovie,
    getMovie,
    getMovies
};
