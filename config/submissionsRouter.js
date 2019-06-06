const express = require('express');
const auth = require('../middleware/auth');
const categoriesApi = require('../apis/db/categories');
const challengesCategoriesApi = require('../apis/db/challengesCategories');
const challengesApi = require('../apis/db/challenges');
const userSubmissionsApi = require('../apis/db/userSubmissions');

const router = express.Router();

// Add Challenge Submission Endpoint
// ID param refers to the ID of the challenge the submission is for
// Accessible by any registered user
router.post('/:id', (req, res) => {

    //Todo: Add validation once payload format is decided upon
    //Check that the submission ID exists and is an approved challenge

    //Insert the new challenge into the database
    userSubmissionsApi.insert({
        ...req.body,
        challenge_id: req.params.id,
        created_by: req.headers.user.id
    })
    .then(dbRes => {
        //Returns the new submission object
        res.status(200).send(dbRes);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
});

// Save a user's submission answer
// Takes the ID of the submission
// Solution should be the only column users are allowed to updated
// Users should only be able to update their own submissions
// Check to make sure the submission exists- If not throw an error
router.put('/:id', auth, (req, res) => {

    //Used as a toggle invalid submission state to skip update
    let valid = true;

    //For each property in the body of the request
    Object.keys(req.body).forEach(property => {

        //If there's a property other than solutions then toggle valid to false and send back an error
        //Users should only be able to edit their solutions
        if (property !== 'solutions') {
            valid = false;
            req.status(422).send({
                message: 'Only solutions can be edited'
            });
        }
    })

    //Ensure the payload was valid
    if (valid) {

        //Update the user's challenge_submission entry for the challenge specified in the id param
        userSubmissionsApi.update({
                challenge_id: req.params.id,
                created_by: req.params.id
            }, req.body)
            .then(dbRes => {
                //Returns an updated submission object
                res.status(200).send(dbRes);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message
                });
            });
    }
});

// Object-literal query parameters located in req.params can be used to filter query results
// Users should only be able to access their own submissions
// Get user ID out of the req.headers.users which is populated in the auth middleware
// Any registered user can access this endpoint
// Returns an array of submissions
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
                message: err.message
            });
        });
});

module.exports = router;