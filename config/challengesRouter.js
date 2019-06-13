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

    //Todo: Validation of format of payload
    //Todo: Figure out how to use bridge table for matching categories to challenges and parsing the response

    challengesApi.insert(challenge)
        .then(dbRes => {
            res.status(201).send(dbRes);
        })
        .catch(err => {
            res.status(500).send({
                message: 'Internal Server Error'
            });
        });
});


router.get('/', auth, (req, res) => {
    const filter = req.query;
    if(req.headers.role === "user") {
        if(filter.approved === undefined) {
            filter.approved = true;
        } else if (filter.approved === false) {
            filter.created_by = req.headers.user.id;
        }
    } else if (filter.approved === undefined) {
        filter.approved = true;
    }

    //Todo: Validate query parameters
    //Todo: Figure out how to use bridge table for matching categories to challenges and parsing the response

    challengesApi.getMany(filter)
    .then(dbRes => {
        res.status(200).send(dbRes);
    })
    .catch(err => {
        console.log(err)
        res.status(500).send({
            message: 'Internal Server Error'
        });
    });
});


router.put('/', auth, (req, res) => {

    const selector = {
        id: req.body.id
    }

    if(req.headers.user.role !== 'admin') {
        selector.approved = false;
    }
    
    //TODO: Validation the request body
    //Todo: Figure out how to use bridge table for matching categories to challenges and parsing the response
    
    if(req.headers.user.role === 'user') {
        selector.created_by = req.headers.user.id;
    }

    challengesApi.update(selector, req.body)
        .then(dbRes => {
            res.status(200).send(dbRes);
        })
        .catch(err => {
            res.status(500).send({
                message: 'Internal Server Error'
            });
        });
})

module.exports = router;
