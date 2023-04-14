const express = require('express');

const routes = require('./routes');
const { errorHandler } = require('./middleware');

const app = express();
app.use(express.json());

app.use(routes);
app.use(errorHandler);

module.exports = app;
