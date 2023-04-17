const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');
const Movie = require('./movie');

class Actor extends Model {}

Actor.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: DataTypes.STRING,
}, {
    sequelize,
});

Movie.belongsToMany(Actor, { through: 'ActorMovies' });
Actor.belongsToMany(Movie, { through: 'ActorMovies' });

module.exports = Actor;
