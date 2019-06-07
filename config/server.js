const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const usersRouter = require('./usersRouter');
const challengesRouter = require('./challengesRouter');
const submissionsRouter = require('./submissionsRouter');
const validationRouter = require('./validationRouter');
const auth = require('../middleware/auth');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());


server.use('/api/users', auth, usersRouter);
server.use('/api/challenges', auth, challengesRouter);
server.use('/api/submissions', auth, submissionsRouter);
server.use('/api/validation', auth, validationRouter);

server.get('/', auth, (req, res) =>
    res.status(200).send({
        message: "API is alive"
    }));

module.exports = server;