const express = require('express');
const auth = require('../middleware/auth');
const categoriesApi = require('../apis/db/categories');
const challengesCategoriesApi = require('../apis/db/challengesCategories');
const challengesApi = require('../apis/db/challenges');
const userSubmissionsApi = require('../apis/db/userSubmissions');

const router = express.Router();

router.post('/', (req, res) => {

    //Todo: Add validation once payload format is decided upon
    //Check that the challenge ID exists and is an approved challenge
    //Check to make sure submission does not exist for user

    //Insert the new challenge into the database
    userSubmissionsApi.insert({
            ...req.body,
            challenge_id: req.body.challenge_id,
            created_by: req.headers.user.id
        })
        .then(dbRes => {
            //Returns the new submission object
            res.status(200).send(dbRes);
        })
        .catch(err => {
            res.status(500).send({
                message: 'Internal Server Error'
            });
        });
});

router.put('/', auth, (req, res) => {

    //Todo: Validation of request body

    //Update the user's challenge_submission entry for the challenge specified in the id param
    userSubmissionsApi.update({
            id: req.body.id,
            created_by: req.headers.user.id
        }, req.body)
        .then(dbRes => {
            //Returns an updated submission object
            res.status(200).send(dbRes);
        })
        .catch(err => {
            res.status(500).send({
                message: 'Internal Server Error'
            });
        });
});

router.get('/', auth, (req, res) => {

    //Users can only retrieve submissions they have created
    req.query.created_by = req.headers.user.id;

    //Get all applicable submissions
    userSubmissionsApi.getMany(req.query)
        .then(dbRes => {
            //Returns an array of all submissions matching the filter
            res.status(200).send(dbRes);
        })
        .catch(err => {
            res.status(500).send({
                message: 'Internal Server Error'
            });
        });
});

module.exports = router;