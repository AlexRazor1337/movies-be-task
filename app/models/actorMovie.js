const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');
const Movie = require('./movie');
const Actor = require('./actor');

class ActorMovie extends Model {}

ActorMovie.init({
    movieId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    actorId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
}, {
    sequelize,
});

module.exports = ActorMovie;
