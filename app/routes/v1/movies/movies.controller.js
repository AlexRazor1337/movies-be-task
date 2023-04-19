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

    const prevActors = await movie.getActors();

    try {
        await movie.update({
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

    // Get and destroy all actors that are not in any movie anymore
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

    const searchActorLiteral = (actor) => {
        return sequelize.literal(`Movie.id IN
            (SELECT "movieId" FROM "ActorMovies" WHERE "actorId" IN
            (SELECT id FROM "actors" WHERE "name" LIKE '%${actor}%'))`)
    }

    // Use sequelize.literal because of sequelize issues with eager loading, subQuery and where conditions
    // See https://github.com/sequelize/sequelize/issues/9605
    // Also https://github.com/sequelize/sequelize/issues/12971

    if (title) {
        where.title = {
            [Op.like]: `%${title}%`,
        }
    }

    if (actor) {
        where[Op.or] = [
            searchActorLiteral(actor),
        ]
    }

    if (search) {
        where[Op.or] = [
            {
                title: {
                    [Op.like]: `%${search}%`,
                }
            },
            searchActorLiteral(search),
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
        distinct: true,
    });

    if (sort === 'title') {
        data.sort((a, b) => {
            // Compare utf strings ignoring case
            const direction = order === 'ASC' ? 1 : -1;
            return direction * a.title.localeCompare(b.title, 'en', { sensitivity: 'base' });
        });
    }

    return {
        status: 1,
        data,
        meta: {
            total,
        }
    }
}

const importMovies = async (movies) => {
    const content = Buffer.from(movies.buffer, 'base64').toString('utf-8')

    const regex = /Title: (.+).*\nRelease Year: (\d{4}).*\nFormat: (.+).*\nStars: (.+).*/gm;

    let totalMovies = [...content.trim().matchAll(regex)].map((movie) => {
        const [, title, year, format, actors] = movie;

        return {
            title: title.trim(),
            year,
            format,
            actors: actors.split(', '),
        };
    });

    const totalCount = totalMovies.length;

    totalMovies = totalMovies.filter((movie) => {
        const { title, year, format, actors } = movie
        const regex = /[\d~`!@#$%^&*()\_=+[\]{}\\|;:'",.<>\/?]/;

        if (title.length === 0) return false;
        if (year < 1850 || year > 2023) return false;
        if (!['VHS', 'DVD', 'Blu-Ray'].includes(format)) return false;
        if (actors.some((actor) => actor.match(regex))) return false;

        return true;
    })

    console.log(totalMovies)

    const transaction = await sequelize.transaction(); // Because of SQLite

    const allActors = [...new Set(totalMovies.reduce((acc, movie) => acc.concat(movie.actors), []))];
    const movieActors = await Promise.all(allActors.map((actorName) => {
        return Actor.findOrCreate({
            where: {
                name: actorName,
            },
            transaction,
        })
    })).then((act) => act.map((actor) => actor[0]));

    await transaction.commit();

    const importedMovies = await Movie
        .bulkCreate(totalMovies, { ignoreDuplicates: true })
        .then((movies) => Movie.findAll({ // To simulate 'returning' option
            where: {
                title: { [Op.in]: movies.map((movie) => movie.title) }
            }
        }));

    await Promise.all(importedMovies.map((movie) => {
        const actors = movieActors.filter((actor) => {
            return totalMovies.find((m) => m.title === movie.title).actors.includes(actor.name);
        });
        console.log(movie.id, movie)
        return movie.setActors(actors);
    }));

    return {
        status: 1,
        data: importedMovies,
        meta: {
            total: totalCount,
            imported: importedMovies.length
        }
    }
}

module.exports = {
    createMovie,
    deleteMovie,
    updateMovie,
    getMovie,
    getMovies,
    importMovies,
};
