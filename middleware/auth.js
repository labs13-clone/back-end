const jwt = require('jsonwebtoken');
const auth0Api = require('../apis/external/auth0');
const usersDbApi = require('../apis/db/users');

module.exports = function (req, res, next) {

    //If there's not a token in the authorization header then throw an error
    if (req.headers.authorization === undefined) {
        res.status(401).send({
            message: 'Log In First'
        });
    } else {

        //Verify whatever is in the authorization header
        jwt.verify(req.headers.authorization, auth0Api.getKid(), function (err, decoded) {

            //If the signature on the token is invalid throw an error
            if (err) res.status(400).send({
                message: 'Invalid Token'
            });

            //Set the decoded token payload (user object) to the request header
            req.headers.user = decoded;

            //Query the database by sub id to see if any users have the same sub id
            usersDbApi.getOne({sub_id: decoded.sub})
                .then(user => {

                    //If no user is found
                    if (user === undefined) {

                        //Insert them into the database
                        usersDbApi.add({
                            sub_id: decoded.sub
                        })
                        
                        //Add concatenated user data to header
                        .then(user => {
                            req.headers.user = {
                                ...req.headers.user,
                                user
                            };

                            next();
                        })
                    }

                    //Else user was found, combine user info from db with decoded token
                    else {
                        req.headers.user = {
                            ...req.headers.user,
                            user
                        };

                        next();
                    }
                })
                .catch(err => {
                    res.status(500).send({
                        message: 'Internal Server Error'
                    });
                });

        })
    }
}