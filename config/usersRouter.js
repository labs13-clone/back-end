const express = require('express');
const userApi = require('../apis/db/users');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, (req, res) => {

    //TODO: Calculate XP earned from submissions that are completed and return it

    //Return user information
    res.status(200).send(req.headers.user);
});

module.exports = router;