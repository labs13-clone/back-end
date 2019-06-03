const express = require('express');
const userApi = require('../api/usersDb');
const auth = require('./authMiddleware');

const router = express.Router();

router.get('/', auth, (req, res) => {
    userApi.getMany()
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