const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {

    //Return user information
    //It is already populated from the middleware
    res.status(200).send(req.headers.user);
});

module.exports = router;