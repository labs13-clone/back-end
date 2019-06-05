const express = require('express');
const auth = require('../middleware/auth');
const categoriesApi = require('../apis/db/categories');
const challengesCategoriesApi = require('../apis/db/challengesCategories');
const challengesApi = require('../apis/db/challenges');
const userSubmissionsApi = require('../apis/db/userSubmissions');

const router = express.Router();

// Replace with Challenge Routes

// Allow any registered user to create a challenge
// Double check the approved column is false
// Validate format of payload
router.post('/', auth, (req, res) => {
    const challenge = {
        ...req.body,
        created_by: req.headers.user.id,
        approved: false
    }

    //todo: validation of format of payload
    challengesApi.insert(challenge)
        .then(dbRes => {
            res.status(201).send(dbRes);
        })
        .catch(err => {
            res.status(400).send({
                message: err.message
            },console.log(err))
        })
});

// Query parameters can be used to filter results
// By default it returns all approved challenges
// Any registered user can access this endpoint
// Regular users should only be able to access approved challenges no matter if they created them or not, and unapproved challenges that they created
// Only admins can access all challenges
// Returns an array of challenges
router.get('/', auth, (req, res) => {
    const filter = req.query
    if(req.headers.role === "user") {
        if(filter.approved === undefined) {
            filter.approved = true;
        } else if (filter.approved === false) {
            filter.created_by = req.headers.user.id    
        }
    } else if (filter.approved === undefined) {
        filter.approved = true;
    }

    challengesApi.getMany(filter)
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
