# movies-be-task

Build Docker image:
```sh
docker build . -t alexrazor/movies
```

Run app using Docker:
```sh
docker run --name movies -p 8000:8050 -e APP_PORT=8050 alexrazor/movies
```
