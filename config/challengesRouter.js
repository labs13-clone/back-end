const express = require('express');
const auth = require('../middleware/auth');
const challengesApi = require('../apis/db/challenges');
const validateUserInput = require('../middleware/validateUserInput');
const challengesValidation = require('./challengesValidation');

const router = express.Router();


router.post('/', auth, validateUserInput(challengesValidation.post), (req, res) => {
    challengesApi.insert(req.body)
        .then(dbRes => {
            res.status(201).send(dbRes);
        })
        .catch(err => {
            res.status(500).send({
                message: 'Internal Server Error'
            });
        });
});

router.get('/', auth, validateUserInput(challengesValidation.get), (req, res) => {

    challengesApi.getMany(req.query)
        .then(dbRes => {
            res.status(200).send(dbRes);
        })
        .catch(err => {
            res.status(500).send({
                message: 'Internal Server Error'
            });
        });
});


router.put('/', auth, validateUserInput(challengesValidation.put), (req, res) => {

    const id = req.body.id;
    delete req.body.id;

    challengesApi.update({
            id
        }, req.body)
        .then(dbRes => {
            res.status(200).send(dbRes);
        })
        .catch(err => {
            console.log('put-challenge', err)
            res.status(500).send({
                message: 'Internal Server Error'
            });
        });
});

module.exports = router;