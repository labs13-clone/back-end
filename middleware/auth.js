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

        //AuthO 2.0 standards are to include the token type in the Authorization header
        //auth0 package follows these standards, and includes 'Bearer' in the header with a space after
        //We need to remove it to get only the token in order to authenticate it
        const token = req.headers.authorization.split(' ')[1];

        //Verify and decode whatever is in the authorization header using jwt.verify and the public key using the auth0 API
        //The public key aka. cert is used to verify the token was not tampered with and was generated by Auth0
        jwt.verify(token, auth0Api.pubKey(),

            //jwt.verify Options object:
            {
                //Todo: Remove ignoreExpiration later once we can easily generate new tokens
                ignoreExpiration: true,
                //iss and aud are used to verify Auth0 created token for our app
                iss: 'https://labs13codingclone.auth0.com/',
                aud: [
                    'http://labs13codingclone.com/api',
                    'https://labs13codingclone.auth0.com/userinfo'
                ]
            },

            //jwt.verify callback
            function (err, decodedAccessToken) {

                //If the signature on the token is invalid throw an error
                if (err) {
                    res.status(400).send({
                        message: 'Invalid Token'
                    });
                } else {

                    //Set the users role according to the permissions property
                    if (decodedAccessToken.permissions.includes('admin:admin')) {

                        //var used to declare role so the variable is accessible outside this if/else statement
                        var role = 'admin';
                    } else {
                        var role = 'user';
                    }

                    //Query the database by sub id to see if any users have the same sub id
                    return usersDbApi.getOne({
                            sub_id: decodedAccessToken.sub
                        })
                        .then(async user => {

                            //If no user is found
                            if (user === undefined) {

                                //Get the decoded token from the 
                                //https://labs13codingclone.auth0.com/userinfo
                                const decodedIdentityToken = await auth0Api.getUserProfile(req.headers.authorization);

                                console.log(decodedIdentityToken)

                                //Insert them into the database
                                usersDbApi.insert({
                                        sub_id: decodedAccessToken.sub,
                                        nickname: decodedIdentityToken.nickname,
                                        picture: decodedIdentityToken.picture,
                                    })
                                    //Add user info to request headers
                                    .then(user => {
                                        req.headers.user = {
                                            ...user,
                                            role
                                        };

                                        next();

                                        //Returning null because of this warning:
                                        //(node:11538) Warning: a promise was created in a handler but was not returned from it, see http://goo.gl/rRqMUw
                                        return null;
                                    })
                                    .catch(err => {

                                        //TODO: Find a better way to do this
                                        //When someone registers for the first time
                                        //It will try to insert them several times
                                        //And get a unique key restraint error
                                        //This is a temporary workaround
                                        if (err.code === '23505') {

                                            //Get user info
                                            usersDbApi.getOne({
                                                    sub_id: decodedAccessToken.sub
                                                })

                                                //Add user info to request headers
                                                .then(user => {
                                                    req.headers.user = {
                                                        ...user,
                                                        role
                                                    };

                                                    next();

                                                    //Returning null because of this warning:
                                                    //(node:11538) Warning: a promise was created in a handler but was not returned from it, see http://goo.gl/rRqMUw
                                                    return null;
                                                })
                                        } else {
                                            console.log(typeof err.code, err.code)
                                        }

                                    })
                            }

                            //Else user was found, combine user info from db with decodedAccessToken token
                            else {
                                req.headers.user = {
                                    ...user,
                                    role
                                };

                                next();

                                //Returning null because of this warning:
                                //(node:11538) Warning: a promise was created in a handler but was not returned from it, see http://goo.gl/rRqMUw
                                return null;
                            }
                        })
                        .catch(err => {
                            res.status(500).send({
                                message: 'Internal Server Error'
                            });
                        });

                }
            });
    }
}