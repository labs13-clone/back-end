const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const usersRouter = require('./usersRouter');
const challengesRouter = require('./challengesRouter');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.get('/', (req, res) =>
    res.status(200).send({
        message: "API is alive"
    }));
server.use('/users', usersRouter);
server.use('/challenges', challengesRouter);

module.exports = server;