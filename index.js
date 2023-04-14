require('module-alias/register');

const app = require('@/app');

const port = process.env.APP_PORT;
if (!port) throw new Error('APP_PORT enviroment variable is not set!');

app.listen(port, () => console.log(`Started server on port ${port}!`));
