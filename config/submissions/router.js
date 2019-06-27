const express = require('express');
const challengesApi = require('../../apis/db/challenges');
const userSubmissionsApi = require('../../apis/db/userSubmissions');
const validate = require('./validation');

const router = express.Router();

router.post('/', validate.post, (req, res) => {

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

router.put('/exec', validate.putExec, (req, res) => {

    //Remove the user ID from the request body
    const id = req.body.id;
    delete req.body.id;

    //Update the user_submissions
    userSubmissionsApi.update({
            id
        }, req.body)
        .then(dbRes => {

            //Returns the updated submission object
            res.status(200).send(dbRes);
        })
        .catch(err => {
            res.status(500).send({
                message: 'Internal Server Error'
            });
        });
});

router.put('/test', validate.putTest, (req, res) => {

    //Remove the user ID from the request body
    const id = req.body.id;
    delete req.body.id;

    //Update the user_submissions
    userSubmissionsApi.update({
            id
        }, req.body)
        .then(dbRes => {

            //Returns the updated submission object
            res.status(200).send(dbRes);
        })
        .catch(err => {
            res.status(500).send({
                message: 'Internal Server Error'
            });
        });
});

router.put('/attempt', validate.putAttempt, (req, res) => {

    //Todo: Validate their solution passes all tests for the code challenge
    //For now we assume they pass all tests
    //Validation happens on frontend
    req.body.completed = true;

    //Remove the user ID from the request body
    const id = req.body.id;
    delete req.body.id;

    //Update the user_submissions
    userSubmissionsApi.update({
            id
        }, req.body)
        .then(dbRes => {

            //Returns the updated submission object
            res.status(200).send(dbRes);
        })
        .catch(err => {
            res.status(500).send({
                message: 'Internal Server Error'
            });
        });
});

router.put('/reset', validate.putReset, (req, res) => {

    //Remove the user ID from the request body
    const id = req.body.id;
    delete req.body.id;

    //Update the user's challenge_submission entry for the challenge specified in the id param
    userSubmissionsApi.update({
            id
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

router.get('/', validate.get, (req, res) => {

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