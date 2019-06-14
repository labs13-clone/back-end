const express = require('express');
const categoriesApi = require('../apis/db/categories');
const challengesCategoriesApi = require('../apis/db/challengesCategories');

const router = express.Router();

router.get('/', (req, res) => {

    //Get an array of categories from the database
    categoriesApi.getMany()
    .then(response => {
        //Return an array of category information
        res.status(200).send(response);
    })
    .catch(err => {
        res.status(500).send({message: 'Internal Server Error'});
    })
});

router.post('/challenges', (req, res) => {

    //Todo: Validation of format of payload

    challengesCategoriesApi.insert(req.body)
        .then(dbRes => {
            res.status(201).send(dbRes);
        })
        .catch(err => {
            res.status(500).send({
                message: 'Internal Server Error'
            });
        });
});

module.exports = router;


module.exports = router;