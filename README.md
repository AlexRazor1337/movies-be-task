# movies-be-task

This is a simple REST API for movies management.
It is written in JavaScript using Node.js and Express.js, sequelize ORM and sqlite3 database.

There are 3 main entities: users, movies and actors.
Users can register and login to the system. After that they can create and manage movies.

Movies and actors are connected with many-to-many relationship, using through table **ActorMovie**.

Main app logic is inside `app` folder.

`app.js` - main app file, where routes and global middleware are connected and app is initialized.  
`db.js` - file for database initialization and connection.

`routes` folder contains all routes for the app. Each route group has router, controller with logic, validation schema file.  

`middlewares` folder contains all middlewares for the app:
- **validator** middleware is used for validation of requests, before it goes to the controller.
- **auth** middleware is used for authentication of users. It checks that JWT token exists and valid.
- **errorHandler** global error handler for any uncatched errors.

## How to run

Build Docker image:
```sh
docker build . -t alexrazor/movies
```

Run app using Docker:
```sh
docker run --name movies -p 8000:8050 -e APP_PORT=8050 alexrazor/movies
```

### Possible ENV variables for configuration

`APP_PORT` - port for the app to listen inside a container, default - `8050`
`JWT_SECRET` - secret for JWT token generation/verification, default - `secret`
`DB_PATH` - path to the sqlite3 database file inside a container - default - `./db.sqlite`
