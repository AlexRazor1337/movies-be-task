const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');
const Movie = require('./movie');
const ActorMovie = require('./actorMovie');

class Actor extends Model {}

Actor.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    sequelize,
});

Movie.belongsToMany(Actor, { through: ActorMovie, foreignKey: 'movieId', as: 'actors' });
Actor.belongsToMany(Movie, { through: ActorMovie, foreignKey: 'actorId' });

module.exports = Actor;
