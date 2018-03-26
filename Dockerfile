FROM node:8.9.3

WORKDIR /home/src

COPY . .

RUN npm install
RUN ./node_modules/.bin/tsc

CMD ./node_modules/.bin/sequelize db:migrate && node app/bootstrap.js