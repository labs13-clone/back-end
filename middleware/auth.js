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

        //Verify and decode whatever is in the authorization header using jwt.verify and the public key using the auth0 API
        //The public key aka. cert is used to verify the token was not tampered with and was generated by Auth0
        jwt.verify(req.headers.authorization, auth0Api.getPubKey(),

            //jwt.verify Options object:
            {
                //Todo: Remove ignoreExpiration later once we can easily generate new tokens
                ignoreExpiration: true,
                //iss and aud are used to verify Auth0 created token for our app
                iss: 'https://labs13codingclone.auth0.com/',
                aud: ['http://labs13codingclone.com/api',
                    'https://labs13codingclone.auth0.com/userinfo'
                ]
            },

            //jwt.verify callback
            function (err, decoded) {

                //If the signature on the token is invalid throw an error
                if (err) {
                    res.status(400).send({
                        message: 'Invalid Token'
                    });
                } else {

                    //Set the users role according to the permissions property
                    if (decoded.permissions.includes('admin:admin')) {
                        var role = 'admin';
                    } else {
                        var role = 'user';
                    }

                    //Query the database by sub id to see if any users have the same sub id
                    usersDbApi.getOne({
                            sub_id: decoded.sub
                        })
                        .then(user => {

                            //If no user is found
                            if (user === undefined) {

                                //Insert them into the database
                                usersDbApi.insert({
                                        sub_id: decoded.sub
                                    })

                                    //Add user info to request headers
                                    .then(user => {
                                        req.headers.user = {
                                            ...user,
                                            role
                                        };

                                        next();
                                    })
                            }

                            //Else user was found, combine user info from db with decoded token
                            else {
                                req.headers.user = {
                                    ...user,
                                    role
                                };

                                next();
                            }
                        })
                        .catch(err => {
                            res.status(500).send({
                                message: 'Internal Server Error'
                            });
                        });

                }
            })
    }
}