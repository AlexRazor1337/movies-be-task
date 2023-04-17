const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');

class Movie extends Model {}

Movie.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    format: {
        type: DataTypes.ENUM('DVD', 'VHS', 'Blu-Ray'),
        allowNull: false,
    },
}, {
    sequelize,
});

module.exports = Movie;
