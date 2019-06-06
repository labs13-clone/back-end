const express = require('express');
const userSubmissionsApi = require('../apis/db/userSubmissions');
const auth = require('../middleware/auth');

const router = express.Router();

// Validate a user has the correct answer and update the database entry accordingly
// The answer should be updated using PUT /api/submissions before requesting this endpoint
// Uses the ID of the applicable user_submission entry
// Users should only be able to request validation on submissions they created
// Users should only be able to request validation of solutions which have not already been verified as correct
router.get('/:id', auth, (req, res) => {

    //Todo: Validate the ID provided exists and was created_by the user
    //Use the retrieved DB entry to get the current attempt # and increase the # by one when updating

    //Todo: Validate their solution passes all tests for the code challenge
    //For now we assume they pass all tests

    //Update the user_submissions
    userSubmissionsApi.update(req.params.id, {
        completed: 1
    })
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