const express = require('express');
const userApi = require('../apis/db/users');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, (req, res) => {

    //TODO: Figure out exactly what data needs to be returned

    //Return user information
    res.status(200).send(req.headers.user);
});

module.exports = router;