const validate = require('../../utility/validate');

function post(req, res, next) {

    //Check data type of body (Object)
    if (!validate.isObject(req.body)) {

        res.status(422).send({
            message: "The request body must be an object"
        });
    } else {

        //Validate object
        validateObject(req.body)
            .then(_ => {

                //Force the following fields to exist and be of a certain value
                req.body.created_by = req.headers.user.id;
                req.body.approved = false;
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
            if (obj.title === undefined) {
                outerReject({
                    code: 422,
                    message: `The request body is missing a title`
                });
            } else if (obj.description === undefined) {
                outerReject({
                    code: 422,
                    message: `The request body is missing a description`
                });
            } else if (obj.tests === undefined) {
                outerReject({
                    code: 422,
                    message: `The request body is missing tests`
                });
            } else if (obj.skeleton_function === undefined) {
                outerReject({
                    code: 422,
                    message: `The request body is missing a skeleton function`
                });
            } else if (obj.solution === undefined) {
                outerReject({
                    code: 422,
                    message: `The request body is missing a solution`
                });
            } else if (obj.difficulty === undefined) {
                outerReject({
                    code: 422,
                    message: `The request body is missing the difficulty`
                });
            } else {

                //For each property
                const propertyChecks = Object.keys(obj).map(key => {

                    return new Promise(async (innerResolve, innerReject) => {

                        //Check if the property is in the list of valid properties
                        const validProperties = ['title', 'description', 'tests', 'skeleton_function', 'solution', 'difficulty', 'created_by'];
                        if (!validProperties.includes(key)) {
                            innerReject({
                                code: 422,
                                message: `The request body can not contain ${key}`
                            });
                        }

                        //Else run title specific checks
                        else if (key === 'title') {

                            //Make sure it's a string
                            if (!validate.isString(obj[key])) {

                                innerReject({
                                    code: 422,
                                    message: `${key} must be a string`
                                });
                            }

                            //Make sure the category exists
                            else if (await validate.existsWhere('challenges', {
                                    title: obj[key]
                                })) {

                                innerReject({
                                    code: 422,
                                    message: `The title ${obj[key]} is already taken`
                                });
                            }

                        }

                        //Else run description specific checks
                        else if (key === 'description') {

                            //Make sure it's a string
                            if (!validate.isString(obj[key])) {

                                innerReject({
                                    code: 422,
                                    message: `${key} must be a string`
                                });
                            }
                        }

                        //Else run tests specific checks
                        else if (key === 'tests') {

                            //Make sure it's json
                            if (!validate.isArray(obj[key])) {
                                innerReject({
                                    code: 422,
                                    message: `${key} must be an Array of test objects`
                                });
                            } else {

                                //Verify the test schema includes descriptor, argumentsToPass, and expectedResult
                                //And that each are Strings
                                obj[key].forEach(test => {
                                    if (test.descriptor === undefined) {
                                        innerReject({
                                            code: 422,
                                            message: `All ${key} must have a descriptor parameter`
                                        });
                                    } else if (!validate.isString(test.descriptor)) {
                                        innerReject({
                                            code: 422,
                                            message: `The descriptor in ${key} must be a string`
                                        });
                                    } else if (test.argumentsToPass === undefined) {
                                        innerReject({
                                            code: 422,
                                            message: `All ${key} must have a argumentsToPass parameter`
                                        });
                                    } else if (!validate.isString(test.argumentsToPass)) {
                                        innerReject({
                                            code: 422,
                                            message: `The argumentsToPass in ${key} must be a string`
                                        });
                                    }
                                    if (test.expectedResult === undefined) {
                                        innerReject({
                                            code: 422,
                                            message: `All ${key} must have a expectedResult parameter`
                                        });
                                    } else if (!validate.isString(test.expectedResult)) {
                                        innerReject({
                                            code: 422,
                                            message: `The expectedResult in ${key} must be a string`
                                        });
                                    }
                                });

                                //Make sure the tests are in JSON form before inserting it into the database
                                req.body[key] = JSON.stringify(req.body[key]);
                            }
                        }

                        //Else run skeleton_function specific checks
                        else if (key === 'skeleton_function') {

                            //Make sure it's json
                            if (!validate.isString(obj[key])) {

                                innerReject({
                                    code: 422,
                                    message: `${key} must be a string`
                                });
                            }
                        }

                        //Else run difficulty specific checks
                        else if (key === 'difficulty') {

                            //Make sure it's json
                            if (!validate.isInteger(obj[key])) {
                                innerReject({
                                    code: 422,
                                    message: `${key} must be a string`
                                });
                            } else {
                                //Else ensure it's in integer form not a string
                                req.body[key] = parseInt(req.body[key], 10);

                                //Ensure it's within range
                                if (obj[key] < 1 || obj[key] > 100) {
                                    innerReject({
                                        code: 422,
                                        message: `${key} must be between 1 and 100`
                                    });
                                }
                            }
                        }

                        //Else run solution specific checks
                        else if (key === 'solution') {

                            //Make sure it's json
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

function get(req, res, next) {

    //Check data type of body (Object)
    if (!validate.isObject(req.query)) {

        res.status(422).send({
            message: "The request body must be an object"
        });
    } else {

        //Validate object
        validateObject(req.query)
            .then(_ => {

                //Default GET /api/challenges to approved challenges
                if (req.query.approved === undefined) req.query.approved = true;


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

            //For each property
            const propertyChecks = Object.keys(obj).map(key => {

                return new Promise(async (innerResolve, innerReject) => {

                    //Check if the property is in the list of valid properties
                    const validProperties = ['difficulty', 'id', 'category_name', 'title', 'category_id', 'approved', 'created', 'completed', 'started'];
                    if (!validProperties.includes(key)) {
                        innerReject({
                            code: 422,
                            message: `The request body can not contain ${key}`
                        });
                    }

                    //Else run difficulty specific checks
                    else if (key === 'difficulty') {

                        //Make sure it's a range
                        if (!validate.isRange(obj[key])) {

                            innerReject({
                                code: 422,
                                message: `${key} must be a range`
                            });
                        } else {

                            //First convert range into Array form
                            //Update the request object
                            obj[key] = validate.convertRange(obj[key]);
                            req.query[key] = obj[key];

                            //Make sure the range is within the limits
                            if (obj[key][0] < 1 || obj[key][1] > 100) {
                                innerReject({
                                    code: 422,
                                    message: `The ${obj[key]} is not within the range limits (1-100 - inclusive)`
                                });
                            }
                        }

                    }

                    //Else run id specific checks
                    else if (key === 'id') {

                        //Make sure it's an integer
                        if (!validate.isInteger(obj[key])) {

                            innerReject({
                                code: 422,
                                message: `${key} must be an integer`
                            });
                        } else {

                            //Convert to an integer and update the request object
                            obj[key] = parseInt(obj[key], 10);
                            req.query[key] = obj[key];

                            //Make sure the challenge id exists
                            if (!await validate.existsWhere('challenges', {
                                    id: obj[key]
                                })) {

                                innerReject({
                                    code: 422,
                                    message: `A challenge with an ID of ${obj[key]} does not exist`
                                });
                            }
                        }
                    }

                    //Else run category_name specific checks
                    else if (key === 'category_name') {

                        //Make sure it's string
                        if (!validate.isString(obj[key])) {

                            innerReject({
                                code: 422,
                                message: `${key} must be a string`
                            });
                        }

                        //Prep string for knex query
                        else {

                            //Will use partial string match like .where('categories.name', 'like', '%searchterm%')
                            obj[key] = '%' + obj[key] + '%';
                            req.query[key] = obj[key];
                        }
                    }

                    //Else run title specific checks
                    else if (key === 'title') {

                        //Make sure it's string
                        if (!validate.isString(obj[key])) {

                            innerReject({
                                code: 422,
                                message: `${key} must be a string`
                            });
                        }

                        //Prep string for knex query
                        else {

                            //Will use partial string match like .where('categories.title', 'like', '%searchterm%')
                            obj[key] = '%' + obj[key] + '%';
                            req.query[key] = obj[key];
                        }
                    }

                    //Else run category_id specific checks
                    else if (key === 'category_id') {

                        //Make sure it's an integer
                        if (!validate.isInteger(obj[key])) {

                            innerReject({
                                code: 422,
                                message: `${key} must be a string`
                            });
                        } else {

                            //Convert to an integer
                            obj[key] = parseInt(obj[key], 10);
                            req.query[key] = obj[key];

                            //If the category ID does not exist then throw an error
                            if (!await validate.existsWhere('categories', {
                                    id: obj[key]
                                })) {
                                innerReject({
                                    code: 422,
                                    message: `A category with the ID of ${obj[key]} does not exist`
                                });
                            }
                        }
                    }

                    //Else run approved specific checks
                    else if (key === 'approved') {

                        //Make sure it's a boolean or can be converted into a boolean
                        if (!validate.isBoolean(obj[key])) {
                            innerReject({
                                code: 422,
                                message: `${key} must be a string`
                            });
                        } else {

                            //If it's an integer or string then convert it into Boolean
                            if (validate.isString(obj[key]) || validate.isInteger(obj[key])) {

                                //Update the request object
                                obj[key] = validate.convertBoolean(obj[key]);
                                req.query[key] = obj[key];
                            }

                            //If a non-admin is requesting unapproved challenges
                            if (!obj[key] && req.headers.user.role !== 'admin') {

                                //Then make sure they can only retrieve the unapproved challenges they created
                                req.query.created_by = req.headers.user.id;
                            }

                            //Before next() is called we do the following check to default GET /api/challenges to approved challenges
                            //if (req.query.approved === undefined) req.query.approved = true;
                        }
                    }

                    //Else run created specific checks
                    else if (key === 'created') {

                        //Make sure it is a boolean
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

                            //Make sure users only get challenges they created
                            req.query.created_by = req.headers.user.id;

                            //The created boolean is not needed to filter the database query so delete it
                            //created_by is used in a .where() to get challenges they created
                            delete req.query.created;
                        }
                    }

                    //Else run completed specific checks
                    else if (key === 'completed') {

                        //Make sure it is a boolean
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

                            //Make sure users only get challenges they completed
                            req.query.completed_by = req.headers.user.id;

                            //The completed boolean is not needed to filter the database query so delete it
                            //completed_by is translated into user_submissions.created_by via a join on user_submissions
                            //Then used in a .where() to get challenges they completed
                            delete req.query.completed;
                        }
                    }

                    //Else run started specific checks
                    else if (key === 'started') {

                        //Make sure it is a boolean
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

                            //Make sure users only get challenges they started
                            req.query.started_by = req.headers.user.id;

                            //The started boolean is not needed to filter the database query so delete it
                            //started_by is translated into user_submissions.created_by via a join on user_submissions
                            //Then used in a .where() to get challenges they started
                            delete req.query.started;
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

function put(req, res, next) {

    //Check data type of body (Object)
    if (!validate.isObject(req.body)) {

        res.status(422).send({
            message: "The request body must be an object"
        });
    } else {

        //Validate object
        validateObject(req.body)
            .then(_ => {
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
                    message: `The request body is missing the id of the challenge`
                });
            } else if (obj.approved === undefined) {
                outerReject({
                    code: 422,
                    message: `The request body is missing the approved boolean`
                });
            } else if (req.headers.user.role !== 'admin') {
                outerReject({
                    code: 401,
                    message: `You are not authorized to toggle the approval of challenges`
                });
            } else {

                //For each property
                const propertyChecks = Object.keys(obj).map(key => {

                    return new Promise(async (innerResolve, innerReject) => {

                        //Check if the property is in the list of valid properties
                        const validProperties = ['id', 'approved'];
                        if (!validProperties.includes(key)) {
                            innerReject({
                                code: 422,
                                message: `The request body can not contain ${key}`
                            });
                        }

                        //Else run id specific checks
                        else if (key === 'id') {

                            //Make sure it's an integer
                            if (!validate.isInteger(obj[key])) {

                                innerReject({
                                    code: 422,
                                    message: `${key} must be an integer`
                                });
                            }

                            //Make sure the challenge exists
                            else if (!await validate.existsWhere('challenges', {
                                    id: obj[key]
                                })) {

                                innerReject({
                                    code: 422,
                                    message: `A challenge with an id of ${obj[key]} does not exist`
                                });
                            }

                        }

                        //Else run approved specific checks
                        else if (key === 'approved') {

                            //Make sure it's a boolean
                            if (!validate.isBoolean(obj[key])) {

                                innerReject({
                                    code: 422,
                                    message: `${key} must be a boolean`
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

module.exports = {
    post,
    get,
    put
}