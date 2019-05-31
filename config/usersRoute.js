const express = require('express');
const userApi = require('../api/usersDb');

const router = express.Router();

router.get('/', (req, res) => {
    userApi.get()
        .then(dbRes => {
            res.status(200).send(dbRes);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
});

router.post('/', (req, res) => {
    userApi.add(req.body)
        .then(dbRes => {
            res.status(200).send(dbRes);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
});

module.exports = router;