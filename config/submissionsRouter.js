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
    
});

// Save a user's submission answer
// Takes the ID of the submission
// Solution should be the only column users are allowed to updated
// Users should only be able to update their own submissions
// Check to make sure the submission exists- If not throw an error
router.put('/:id', (req, res) => {
    
});

// Object-literal query parameters located in req.params can be used to filter query results
// Users should only be able to access their own submissions
// Get user ID out of the req.headers.users which is populated in the auth middleware
// Any registered user can access this endpoint
// Returns an array of submissions
router.get('/', (req, res) => {

    //Users can only retrieve submissions they have created
    req.params.created_by = req.headers.user.id;

    
    userSubmissionsApi.getMany(req.params)
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