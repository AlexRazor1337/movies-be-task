const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');

class User extends Model {}

User.init({
    email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    name: DataTypes.STRING,
    password: DataTypes.STRING,
}, {
    sequelize,
});

module.exports = User;
