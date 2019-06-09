const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {

    //TODO: Calculate XP earned from submissions that are completed and return it

    //Return user information
    res.status(200).send(req.headers.user);
});

module.exports = router;