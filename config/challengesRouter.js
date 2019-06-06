const express = require('express');
const auth = require('../middleware/auth');
const categoriesApi = require('../apis/db/categories');
const challengesCategoriesApi = require('../apis/db/challengesCategories');
const challengesApi = require('../apis/db/challenges');
const userSubmissionsApi = require('../apis/db/userSubmissions');

const router = express.Router();


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


// TODO do validation for the payload
router.put('/', auth, (req, res) => {
    const selector = {
        id: req.body.id, 
        approved: false
    }

    if(req.headers.user.role === 'user') {
        selector.created_by = req.headers.user.id;
    }

    challengesApi.update(selector, req.body)
        .then(dbRes => {
            res.status(200).send(dbRes);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
})

module.exports = router;
