const express = require('express');
const auth = require('../middleware/auth');
const categoriesApi = require('../apis/db/categories');
const challengesCategoriesApi = require('../apis/db/challengesCategories');
const challengesApi = require('../apis/db/challenges');
const userSubmissionsApi = require('../apis/db/userSubmissions');

const router = express.Router();

// Replace with Challenge Routes
//
// router.get('/', auth, (req, res) => {
    // userApi.getMany()
    //     .then(dbRes => {
    //         res.status(200).send(dbRes);
    //     })
    //     .catch(err => {
    //         res.status(500).send({
    //             message: err.message
    //         });
    //     });
// });

module.exports = router;