const express = require('express');
const categoriesApi = require('../apis/db/categories')

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

module.exports = router;