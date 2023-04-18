FROM node:16
# Create app directory
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev
ENV JWT_SECRET=secret
ENV DB_PATH="./db.sqlite"
ENV APP_PORT=8050
COPY . .
EXPOSE 8050
CMD [ "npm", "start" ]
