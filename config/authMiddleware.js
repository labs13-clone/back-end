const axios = require('axios');
const jwt = require('jsonwebtoken');
const usersDbApi = require('../api/usersDb');
let kid;

axios.get('https://labs13codingclone.auth0.com/.well-known/jwks.json')
    .then(res => {
        kid = res.data.keys[0].kid;
    });

module.exports = function (req, res, next) {

    //If there's not a token in the authorization header then throw an error
    if (req.headers.authorization === undefined) {
        res.status(401).send({
            message: 'Log In First'
        });
    } else {

        //Verify whatever is in the authorization header
        jwt.verify(req.headers.authorization, kid, function (err, decoded) {

            //If the signature on the token is invalid throw an error
            if (err) res.status(400).send({
                message: 'Invalid Token'
            });

            //Set the decoded token payload (user object) to the request header
            req.headers.user = decoded;

            //Do any user have the same sub id?
            usersDbApi.getBySubId(decoded.sub)

                .then(user => {
                    //If no user is found, then insert them into the database
                    if (user === undefined) {
                        usersDbApi.add({
                            sub_id: decoded.sub,
                            role: 'user'
                        });
                    }

                    //Else user was found, combine user info from db with decoded token
                    else {
                        req.headers.user = {
                            ...req.headers.user,
                            user
                        };
                    }
                })
                .catch(err => {
                    res.status(500).send({
                        message: 'Internal Server Error'
                    });
                });

            next();
        })
    }
}