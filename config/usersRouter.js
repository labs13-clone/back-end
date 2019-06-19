const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {

    //Filter out sub_id since it's already available client-side
    const user = req.headers.user;
    delete user.sub_id;

    //Return user information
    //It is already populated from the middleware
    res.status(200).send(user);
});

module.exports = router;