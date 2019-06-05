const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const usersRouter = require('./usersRouter');
const challengesRouter = require('./challengesRouter');
const submissionsRouter = require('./submissionsRouter');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/users', usersRouter);
server.use('/api/challenges', challengesRouter);
server.use('/api/submissions', submissionsRouter);

server.get('/', (req, res) =>
    res.status(200).send({
        message: "API is alive"
    }));

module.exports = server;