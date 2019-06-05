const express = require('express');
const userApi = require('../apis/db/users');
const auth = require('../middleware/auth');

const router = express.Router();

// router.get('/', auth, (req, res) => {
//     userApi.getMany()
//         .then(dbRes => {
//             res.status(200).send(dbRes);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: err.message
//             });
//         });
// });

module.exports = router;