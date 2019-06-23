const express = require('express');
const auth = require('../middleware/auth');
const challengesApi = require('../apis/db/challenges');
const validateUserInput = require('../middleware/validateUserInput');
const challengesValidation = require('./challengesValidation');

const router = express.Router();


router.post('/', auth, validateUserInput(challengesValidation.post), (req, res) => {
    
    //Insert a challenge into the database
    challengesApi.insert(req.body)
        .then(dbRes => {

            //Returns the new challenge object
            res.status(201).send(dbRes);
        })
        .catch(err => {
            res.status(500).send({
                message: 'Internal Server Error'
            });
        });
});

router.get('/', auth, validateUserInput(challengesValidation.get), (req, res) => {

    //Get an array of challenge objects
    //Filterable by query parameters
    challengesApi.getMany(req.query)
        .then(dbRes => {

            //Returns an array of challenge objects
            res.status(200).send(dbRes);
        })
        .catch(err => {
            res.status(500).send({
                message: 'Internal Server Error'
            });
        });
});


router.put('/', auth, validateUserInput(challengesValidation.put), (req, res) => {

    //Remove the row's id from the body
    const id = req.body.id;
    delete req.body.id;

    //Update the challenge
    challengesApi.update({
            id
        }, req.body)
        .then(dbRes => {

            //Returns an updated challenge object
            res.status(200).send(dbRes);
        })
        .catch(err => {
            res.status(500).send({
                message: 'Internal Server Error'
            });
        });
});

module.exports = router;