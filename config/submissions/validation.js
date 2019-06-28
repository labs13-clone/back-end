const validate = require('../../utility/validate');

const get = (req, res, next) => {

    //Validate object
    validateObject(req.query)
        .then(async _ => {

            //Force the following fields to exist and be of a certain value
            //Force created_by value to the user id
            req.query.created_by = req.headers.user.id;

            next();
        })
        .catch(err => {
            res.status(err.code).send({
                message: err.message
            });
        });

    //Validates an object
    function validateObject(obj) {

        return new Promise((outerResolve, outerReject) => {

            //For each property
            const propertyChecks = Object.keys(obj).map(key => {

                return new Promise(async (innerResolve, innerReject) => {

                    //Check if the property is in the list of valid properties
                    const validProperties = ['challenge_id', 'completed'];
                    if (!validProperties.includes(key)) {
                        innerReject({
                            code: 422,
                            message: `The request can not contain the ${key} query parameter`
                        });
                    }

                    //Else run challenge_id specific checks
                    else if (key === 'challenge_id') {

                        //Make sure it's a integer
                        if (!validate.isInteger(obj[key])) {

                            innerReject({
                                code: 422,
                                message: `${key} must be a integer`
                            });
                        } else {

                            //Make sure it's in integer format
                            obj[key] = parseInt(obj[key], 10);
                            req.query.challenge_id = obj[key];

                            //If the challenge doesn't exist
                            if (!await validate.existsWhere('challenges', {
                                    id: obj[key]
                                })) {

                                innerReject({
                                    code: 422,
                                    message: `The challenge ID submitted is not valid`
                                });
                            }

                            //Else If the challenge is not approved
                            else if (!await validate.existsWhere('challenges', {
                                    id: obj[key],
                                    approved: true
                                })) {

                                innerReject({
                                    code: 422,
                                    message: `The challenge you're creating a submission for has not been approved`
                                });
                            }
                        }
                    }

                    //Else run completed specific checks
                    else if (key === 'completed') {

                        //Make sure it's a boolean
                        if (!validate.isBoolean(obj[key])) {

                            innerReject({
                                code: 422,
                                message: `${key} must be a boolean`
                            });
                        } else {

                            //If it's an integer or string then convert it into Boolean
                            if (validate.isString(obj[key]) || validate.isInteger(obj[key])) {

                                //Update the request object
                                obj[key] = validate.convertBoolean(obj[key]);
                                req.query[key] = obj[key];
                            }
                        }
                    }

                    //Resolve the inner promise.
                    //No issues found with this property
                    innerResolve();
                });


            });

            //Wait for all object property checks to finish
            //Immediately throw error if innerReject() is thrown
            Promise.all(propertyChecks)
                .then(_ => outerResolve())
                .catch(err => outerReject(err));
        });
    }
};

const post = (req, res, next) => {

    //Check data type of body (Object)
    if (!validate.isObject(req.body)) {

        res.status(422).send({
            message: "The request body must be an object"
        });
    } else {

        //Validate object
        validateObject(req.body)
            .then(async _ => {

                //Force the following fields to exist and be of a certain value

                //Populate the skeleton function             
                const applicableChallenge = await validate.getWhere('challenges', {
                    id: req.body.challenge_id
                });
                req.body.solution = applicableChallenge.skeleton_function;

                //And force created_by value to the user id
                req.body.created_by = req.headers.user.id;
                next();
            })
            .catch(err => {
                res.status(err.code).send({
                    message: err.message
                });
            });
    }

    //Validates an object
    function validateObject(obj) {

        return new Promise((outerResolve, outerReject) => {

            //If one of these required properties is left out
            //Then the input is an invalid
            if (obj.challenge_id === undefined) {
                outerReject({
                    code: 422,
                    message: `The request body is missing a challenge ID`
                });
            } else {

                //For each property
                const propertyChecks = Object.keys(obj).map(key => {

                    return new Promise(async (innerResolve, innerReject) => {

                        //Check if the property is in the list of valid properties
                        const validProperties = ['challenge_id'];
                        if (!validProperties.includes(key)) {
                            innerReject({
                                code: 422,
                                message: `The request body can not contain ${key}`
                            });
                        }

                        //Else run challenge_id specific checks
                        else if (key === 'challenge_id') {

                            //Make sure it's a integer
                            if (!validate.isInteger(obj[key])) {

                                innerReject({
                                    code: 422,
                                    message: `${key} must be a integer`
                                });
                            } else {

                                //Make sure it's in integer format
                                obj[key] = parseInt(obj[key], 10);
                                req.body.challenge_id = obj[key];

                                //If the challenge doesn't exist
                                if (!await validate.existsWhere('challenges', {
                                        id: obj[key]
                                    })) {

                                    innerReject({
                                        code: 422,
                                        message: `The challenge ID submitted is not valid`
                                    });
                                }

                                //Else If the challenge is not approved
                                else if (!await validate.existsWhere('challenges', {
                                        id: obj[key],
                                        approved: true
                                    })) {

                                    innerReject({
                                        code: 422,
                                        message: `The challenge you're creating a submission for has not been approved`
                                    });
                                }

                                //else if the user already has a user submission for this challenge
                                else if (await validate.existsWhere('user_submissions', {
                                        challenge_id: obj[key],
                                        created_by: req.headers.user.id
                                    })) {

                                    innerReject({
                                        code: 422,
                                        message: `The user already has a submission for this challenge`
                                    });
                                }

                            }
                        }

                        //Resolve the inner promise.
                        //No issues found with this property
                        innerResolve();
                    });
                });

                //Wait for all object property checks to finish
                //Immediately throw error if innerReject() is thrown
                Promise.all(propertyChecks)
                    .then(_ => outerResolve())
                    .catch(err => outerReject(err));
            }
        });
    }
};

const putExec = (req, res, next) => {

    //Check data type of body (Object)
    if (!validate.isObject(req.body)) {

        res.status(422).send({
            message: "The request body must be an object"
        });
    } else {

        //Validate object
        validateObject(req.body)
            .then(async _ => {

                //Force the following fields to exist and be of a certain value

                //Get the current submission
                const currentSubmission = await validate.getWhere('user_submissions', {
                    id: req.body.id
                });

                //Increment code_execs and total_code_execs
                req.body.code_execs = currentSubmission.code_execs + 1;
                req.body.total_code_execs = currentSubmission.total_code_execs + 1;

                next();
            })
            .catch(err => {
                res.status(err.code).send({
                    message: err.message
                });
            });
    }

    //Validates an object
    function validateObject(obj) {

        return new Promise((outerResolve, outerReject) => {

            //If one of these required properties is left out
            //Then the input is an invalid
            if (obj.id === undefined) {
                outerReject({
                    code: 422,
                    message: `The request body is missing a submission ID`
                });
            } else {

                //For each property
                const propertyChecks = Object.keys(obj).map(key => {

                    return new Promise(async (innerResolve, innerReject) => {

                        //Check if the property is in the list of valid properties
                        const validProperties = ['id', 'solution'];
                        if (!validProperties.includes(key)) {
                            innerReject({
                                code: 422,
                                message: `The request body can not contain ${key}`
                            });
                        }

                        //Else run id specific checks
                        else if (key === 'id') {

                            //Make sure it's a integer
                            if (!validate.isInteger(obj[key])) {

                                innerReject({
                                    code: 422,
                                    message: `${key} must be a integer`
                                });
                            } else {

                                //Make sure it's in integer format
                                obj[key] = parseInt(obj[key], 10);
                                req.body.id = obj[key];

                                //If the submission doesn't exist
                                if (!await validate.existsWhere('user_submissions', {
                                        id: obj[key]
                                    })) {

                                    innerReject({
                                        code: 422,
                                        message: `The submission ID submitted is not valid`
                                    });
                                }

                                //Else If the submission is not owned by the user
                                else if (!await validate.existsWhere('user_submissions', {
                                        id: obj[key],
                                        created_by: req.headers.user.id
                                    })) {

                                    innerReject({
                                        code: 422,
                                        message: `The submission ID submitted is not owned by you`
                                    });
                                }

                                //Else If the submission is already completed
                                else if (await validate.existsWhere('user_submissions', {
                                        id: obj[key],
                                        created_by: req.headers.user.id,
                                        completed: true
                                    })) {

                                    innerReject({
                                        code: 422,
                                        message: `You have already completed this challenge`
                                    });
                                }
                            }
                        }

                        //Else run solution specific checks
                        else if (key === 'solution') {

                            //Make sure it's a string
                            if (!validate.isString(obj[key])) {

                                innerReject({
                                    code: 422,
                                    message: `${key} must be a string`
                                });
                            }
                        }

                        //Resolve the inner promise.
                        //No issues found with this property
                        innerResolve();
                    });
                });

                //Wait for all object property checks to finish
                //Immediately throw error if innerReject() is thrown
                Promise.all(propertyChecks)
                    .then(_ => outerResolve())
                    .catch(err => outerReject(err));
            }
        });
    }
};

const putTest = (req, res, next) => {

    //Check data type of body (Object)
    if (!validate.isObject(req.body)) {

        res.status(422).send({
            message: "The request body must be an object"
        });
    } else {

        //Validate object
        validateObject(req.body)
            .then(async _ => {

                //Force the following fields to exist and be of a certain value

                //Get the current submission
                const currentSubmission = await validate.getWhere('user_submissions', {
                    id: req.body.id
                });

                //Increment test_execs and total_test_execs
                req.body.test_execs = currentSubmission.test_execs + 1;
                req.body.total_test_execs = currentSubmission.total_test_execs + 1;

                next();
            })
            .catch(err => {
                res.status(err.code).send({
                    message: err.message
                });
            });
    }

    //Validates an object
    function validateObject(obj) {

        return new Promise((outerResolve, outerReject) => {

            //If one of these required properties is left out
            //Then the input is an invalid
            if (obj.id === undefined) {
                outerReject({
                    code: 422,
                    message: `The request body is missing a submission ID`
                });
            } else {

                //For each property
                const propertyChecks = Object.keys(obj).map(key => {

                    return new Promise(async (innerResolve, innerReject) => {

                        //Check if the property is in the list of valid properties
                        const validProperties = ['id', 'solution'];
                        if (!validProperties.includes(key)) {
                            innerReject({
                                code: 422,
                                message: `The request body can not contain ${key}`
                            });
                        }

                        //Else run id specific checks
                        else if (key === 'id') {

                            //Make sure it's a integer
                            if (!validate.isInteger(obj[key])) {

                                innerReject({
                                    code: 422,
                                    message: `${key} must be a integer`
                                });
                            } else {

                                //Make sure it's in integer format
                                obj[key] = parseInt(obj[key], 10);
                                req.body.id = obj[key];

                                //If the submission doesn't exist
                                if (!await validate.existsWhere('user_submissions', {
                                        id: obj[key]
                                    })) {

                                    innerReject({
                                        code: 422,
                                        message: `The submission ID submitted is not valid`
                                    });
                                }

                                //Else If the submission is not owned by the user
                                else if (!await validate.existsWhere('user_submissions', {
                                        id: obj[key],
                                        created_by: req.headers.user.id
                                    })) {

                                    innerReject({
                                        code: 422,
                                        message: `The submission ID submitted is not owned by you`
                                    });
                                }

                                //Else If the submission is already completed
                                else if (await validate.existsWhere('user_submissions', {
                                        id: obj[key],
                                        created_by: req.headers.user.id,
                                        completed: true
                                    })) {

                                    innerReject({
                                        code: 422,
                                        message: `You have already completed this challenge`
                                    });
                                }
                            }
                        }

                        //Else run solution specific checks
                        else if (key === 'solution') {

                            //Make sure it's a string
                            if (!validate.isString(obj[key])) {

                                innerReject({
                                    code: 422,
                                    message: `${key} must be a string`
                                });
                            }
                        }

                        //Resolve the inner promise.
                        //No issues found with this property
                        innerResolve();
                    });
                });

                //Wait for all object property checks to finish
                //Immediately throw error if innerReject() is thrown
                Promise.all(propertyChecks)
                    .then(_ => outerResolve())
                    .catch(err => outerReject(err));
            }
        });
    }
};

const putAttempt = (req, res, next) => {

    //Check data type of body (Object)
    if (!validate.isObject(req.body)) {

        res.status(422).send({
            message: "The request body must be an object"
        });
    } else {

        //Validate object
        validateObject(req.body)
            .then(async _ => {

                //Force the following fields to exist and be of a certain value

                //Get the current submission
                const currentSubmission = await validate.getWhere('user_submissions', {
                    id: req.body.id
                });

                //Increment attempts and total_attempts
                req.body.attempts = currentSubmission.attempts + 1;
                req.body.total_attempts = currentSubmission.total_attempts + 1;

                //Todo: validate their solution passes all tests
                //For now automatically assign it as completed
                req.body.completed = true;

                next();
            })
            .catch(err => {
                res.status(err.code).send({
                    message: err.message
                });
            });
    }

    //Validates an object
    function validateObject(obj) {

        return new Promise((outerResolve, outerReject) => {

            //If one of these required properties is left out
            //Then the input is an invalid
            if (obj.id === undefined) {
                outerReject({
                    code: 422,
                    message: `The request body is missing a submission ID`
                });
            } else {

                //For each property
                const propertyChecks = Object.keys(obj).map(key => {

                    return new Promise(async (innerResolve, innerReject) => {

                        //Check if the property is in the list of valid properties
                        const validProperties = ['id', 'solution'];
                        if (!validProperties.includes(key)) {
                            innerReject({
                                code: 422,
                                message: `The request body can not contain ${key}`
                            });
                        }

                        //Else run id specific checks
                        else if (key === 'id') {

                            //Make sure it's a integer
                            if (!validate.isInteger(obj[key])) {

                                innerReject({
                                    code: 422,
                                    message: `${key} must be a integer`
                                });
                            } else {

                                //Make sure it's in integer format
                                obj[key] = parseInt(obj[key], 10);
                                req.body.id = obj[key];

                                //If the submission doesn't exist
                                if (!await validate.existsWhere('user_submissions', {
                                        id: obj[key]
                                    })) {

                                    innerReject({
                                        code: 422,
                                        message: `The submission ID submitted is not valid`
                                    });
                                }

                                //Else If the submission is not owned by the user
                                else if (!await validate.existsWhere('user_submissions', {
                                        id: obj[key],
                                        created_by: req.headers.user.id
                                    })) {

                                    innerReject({
                                        code: 422,
                                        message: `The submission ID submitted is not owned by you`
                                    });
                                }

                                //Else If the submission is already completed
                                else if (await validate.existsWhere('user_submissions', {
                                        id: obj[key],
                                        created_by: req.headers.user.id,
                                        completed: true
                                    })) {

                                    innerReject({
                                        code: 422,
                                        message: `You have already completed this challenge`
                                    });
                                }
                            }
                        }

                        //Else run solution specific checks
                        else if (key === 'solution') {

                            //Make sure it's a string
                            if (!validate.isString(obj[key])) {

                                innerReject({
                                    code: 422,
                                    message: `${key} must be a string`
                                });
                            }
                        }

                        //Resolve the inner promise.
                        //No issues found with this property
                        innerResolve();
                    });
                });

                //Wait for all object property checks to finish
                //Immediately throw error if innerReject() is thrown
                Promise.all(propertyChecks)
                    .then(_ => outerResolve())
                    .catch(err => outerReject(err));
            }
        });
    }
};

const putReset = (req, res, next) => {

    //Check data type of body (Object)
    if (!validate.isObject(req.body)) {

        res.status(422).send({
            message: 'The request body must be an object'
        });
    } else {

        //Validate object
        validateObject(req.body)
            .then(async _ => {

                //Force the following fields to exist and be of a certain value

                //Get the current submission and applicable challenge
                const currentSubmission = await validate.getWhere('user_submissions', {
                    id: req.body.id
                });
                req.body.attempts = 0;
                req.body.code_execs = 0;
                req.body.test_execs = 0;
                req.body.completed = false;

                next();
            })
            .catch(err => {
                res.status(err.code).send({
                    message: err.message
                });
            });
    }

    //Validates an object
    function validateObject(obj) {

        return new Promise((outerResolve, outerReject) => {

            //If one of these required properties is left out
            //Then the input is an invalid
            if (obj.id === undefined) {
                outerReject({
                    code: 422,
                    message: `The request body is missing a submission ID`
                });
            } else {

                //For each property
                const propertyChecks = Object.keys(obj).map(key => {

                    return new Promise(async (innerResolve, innerReject) => {

                        //Check if the property is in the list of valid properties
                        const validProperties = ['id'];
                        if (!validProperties.includes(key)) {
                            innerReject({
                                code: 422,
                                message: `The request body can not contain ${key}`
                            });
                        }

                        //Else run id specific checks
                        else if (key === 'id') {

                            //Make sure it's a integer
                            if (!validate.isInteger(obj[key])) {

                                innerReject({
                                    code: 422,
                                    message: `${key} must be a integer`
                                });
                            } else {

                                //Make sure it's in integer format
                                obj[key] = parseInt(obj[key], 10);
                                req.body.id = obj[key];

                                //If the user_submission doesn't exist
                                if (!await validate.existsWhere('user_submissions', {
                                        id: obj[key],
                                        created_by: req.headers.user.id
                                    })) {

                                    innerReject({
                                        code: 422,
                                        message: `The user does not have a submission for this challenge`
                                    });
                                }

                                //Else If the submission is not already completed
                                else if (!await validate.existsWhere('user_submissions', {
                                        id: obj[key],
                                        created_by: req.headers.user.id,
                                        completed: true
                                    })) {

                                    innerReject({
                                        code: 422,
                                        message: `You have can not reset a challenge you haven't completed`
                                    });
                                }
                            }
                        }

                        //Resolve the inner promise.
                        //No issues found with this property
                        innerResolve();
                    });
                });

                //Wait for all object property checks to finish
                //Immediately throw error if innerReject() is thrown
                Promise.all(propertyChecks)
                    .then(_ => outerResolve())
                    .catch(err => outerReject(err));
            }
        });
    }
};

module.exports = {
    get,
    post,
    putExec,
    putTest,
    putAttempt,
    putReset
}