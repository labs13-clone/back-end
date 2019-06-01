const express = require('express');
const router = require('./config/authRoute');
const cors = require('cors');
const helmet = require('helmet');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.get('/', (req, res) =>
    res.status(200).send({
        message: "API is alive"
    }));
server.use('/users', router);

module.exports = server;