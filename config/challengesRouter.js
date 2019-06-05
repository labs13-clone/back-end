const express = require('express');
const auth = require('../middleware/auth');
const categoriesApi = require('../apis/db/categories');
const challengesCategoriesApi = require('../apis/db/challengesCategories');
const challengesApi = require('../apis/db/challenges');
const userSubmissionsApi = require('../apis/db/userSubmissions');

const router = express.Router();

// Replace with Challenge Routes

router.post('/:id', (req, res) => {
    const challenge = {
        ...req.body,
        created_by: req.params.id
    }
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

router.get('/', (req, res) => {
    challengesApi.getMany()
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