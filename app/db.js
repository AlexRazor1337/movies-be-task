const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_PATH,
});

sequelize.sync();

module.exports = sequelize;
