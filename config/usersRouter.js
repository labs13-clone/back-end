const express = require('express');
const userApi = require('../apis/db/users');
const auth = require('../middleware/auth');

const router = express.Router();

//Gets the current user's profile information.
//The user's information is inserted into req.headers.user via the auth middleware
//So all that needs to be returned is the req.headers.user object
router.get('/', auth, (req, res) => {

    //TODO: Figure out exactly what data needs to be returned

    //Return user information
    res.status(200).send(req.headers.user);
});

module.exports = router;