const express = require('express');
const userSubmissionsApi = require('../apis/db/userSubmissions');
const auth = require('../middleware/auth');

const router = express.Router();

router.put('/', auth, (req, res) => {

    //Todo: Validate the ID provided exists and was created_by the user
    //Use the retrieved DB entry to get the current attempt # and increase the # by one when updating

    //Todo: Validate their solution passes all tests for the code challenge
    //For now we assume they pass all tests
    //Validation happens on frontend

    //Update the user_submissions
    userSubmissionsApi.update(req.body.id, {
            completed: 1,
            solution: req.body.solution
        })
        .then(dbRes => {
            //Returns the updated submission object
            res.status(200).send(dbRes);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
});

module.exports = router;