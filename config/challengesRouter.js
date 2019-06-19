const express = require('express');
const auth = require('../middleware/auth');
const categoriesApi = require('../apis/db/categories');
const challengesCategoriesApi = require('../apis/db/challengesCategories');
const challengesApi = require('../apis/db/challenges');
const userSubmissionsApi = require('../apis/db/userSubmissions');
const validateUserInput = require('../middleware/validateUserInput');

const router = express.Router();


router.post('/', auth,

    // validateUserInput([{
    //         name: 'title',
    //         required: true,
    //         type: 'body',
    //         dataType: 'string',
    //         unique: true,
    //         dbTable: 'challenges'
    //     },
    //     {
    //         name: 'description',
    //         required: true,
    //         type: 'body',
    //         dataType: 'string'
    //     },
    //     {
    //         name: 'tests',
    //         required: true,
    //         type: 'body',
    //         dataType: 'json'
    //     },
    //     {
    //         name: 'skeleton_function',
    //         required: true,
    //         type: 'body',
    //         dataType: 'string'
    //     },
    //     {
    //         name: 'solution',
    //         required: true,
    //         type: 'body',
    //         dataType: 'string'
    //     },
    //     {
    //         name: 'difficulty',
    //         required: true,
    //         type: 'body',
    //         dataType: 'number',
    //         range: [1, 100]
    //     }
    // ]),
     (req, res) => {

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


router.get('/', auth,

// validateUserInput([{
//         name: 'difficulty',
//         required: false,
//         type: 'query',
//         dataType: 'range'
//     },
//     {
//         name: 'created_by',
//         required: false,
//         type: 'query',
//         dataType: 'id',
//         dbTable: 'users',
//         protected: true
//     },
//     {
//         name: 'approved',
//         required: false,
//         type: 'query',
//         dataType: 'boolean',
//         // protected: true,
//         // default: true
//     },
//     {
//         name: 'id',
//         required: false,
//         type: 'query',
//         dataType: 'id',
//         dbTable: 'challenges'
//     },
//     {
//         name: 'category_id',
//         required: false,
//         type: 'query',
//         dataType: 'id',
//         dbTable: 'categories'
//     },
//     {
//         name: 'completed',
//         required: false,
//         type: 'query',
//         dataType: 'boolean'
//     },
//     {
//         name: 'started',
//         required: false,
//         type: 'query',
//         dataType: 'boolean'
//     }
// ]),

(req, res) => {
    const filter = req.query;

    //If it's a normal user
    if (req.headers.user.role === "user") {

        //If the normal user does not define the approved query param
        if (filter.approved === undefined) {

            //Default it to true so only approved challenges are returned
            filter.approved = true;
        }
        //Else if they are requesting an unapproved challenge
        else if (filter.approved === false) {

            //Then only return the unapproved challenges that they created
            filter.created_by = req.headers.user.id;
        }
    }
    //Else default admin approved query param to true unless specifically requesting unapproved challenges
    else if (filter.approved === undefined) {
        filter.approved = true;
    }

    //If requesting the user's completed or started challenges
    //Then assign their user ID to completed_by or _started_by
    if (filter.completed !== undefined) {
        filter.completed_by = req.headers.user.id;
    }
    if (filter.started !== undefined) {
        filter.started_by = req.headers.user.id;
    }

    //Todo: Validate query parameters
    //Todo: Figure out how to use bridge table for matching categories to challenges and parsing the response

    challengesApi.getMany(filter)
        .then(dbRes => {
            res.status(200).send(dbRes);
        })
        .catch(err => {
            res.status(500).send({
                message: 'Internal Server Error'
            });
        });
});


router.put('/', auth, validateUserInput([{
        name: 'id',
        required: true,
        type: 'body',
        dataType: 'number'
    }, {
        name: 'title',
        required: true,
        type: 'body',
        dataType: 'string',
        unique: true,
        dbTable: 'challenges'
    },
    {
        name: 'description',
        required: true,
        type: 'body',
        dataType: 'string'
    },
    {
        name: 'tests',
        required: true,
        type: 'body',
        dataType: 'json'
    },
    {
        name: 'skeleton_function',
        required: true,
        type: 'body',
        dataType: 'string'
    },
    {
        name: 'solution',
        required: true,
        type: 'body',
        dataType: 'string'
    },
    {
        name: 'difficulty',
        required: true,
        type: 'body',
        dataType: 'number',
        range: [1 - 100]
    }
]), (req, res) => {

    console.log('user',req.headers.user)
    console.log('body',req.body)

    const selector = {
        id: req.body.id
    }

    if (req.headers.user.role !== 'admin') {
        selector.approved = false;
    }

    //TODO: Validation the request body
    //Todo: Figure out how to use bridge table for matching categories to challenges and parsing the response

    if (req.headers.user.role === 'user') {
        selector.created_by = req.headers.user.id;
    }

    delete req.body.id;

    console.log(selector,req.body)

    challengesApi.update(selector, req.body)
        .then(dbRes => {
            res.status(200).send(dbRes);
        })
        .catch(err => {
            console.log('put-challenge',err)
            res.status(500).send({
                message: 'Internal Server Error'
            });
        });
})

module.exports = router;