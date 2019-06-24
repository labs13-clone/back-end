const express = require('express');
const usersDb = require('../../apis/db/users');

const router = express.Router();

router.get('/', (req, res) => {

    //Filter out sub_id since it is not needed client-side
    const user = req.headers.user;
    delete user.sub_id;

    //Return user information
    //It is already populated from the auth middleware
    res.status(200).send(user);
});

router.get('/all', async (req, res) => {

    //Return all users  information from db
    usersDb.getMany()
    .then(response => {

        res.status(200).send(response);
    })

    .catch(err => {
        res.status(500).send({message: 'Internal server error'})
    })

    
});

module.exports = router;