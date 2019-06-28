const validate = require('../../utility/validate');

const post = (req, res, next) => {

    //Check data type of body (Array || Object)
    if (!validate.isObject(req.body) && !validate.isArray(req.body)) {

        res.status(422).send({
            message: "The request body must be an array or an object"
        });

    } else if (validate.isArray(req.body)) {

        //Iterate through the array if necessary
        const validations = req.body.map(item => {

            //Validate object
            return validateObject(item);
        });

        //All objects in the array are validated
        Promise.all(validations)
            .then(_ => next())
            .catch(err => {
                res.status(err.code).send({
                    message: err.message
                });
            });

    } else {

        //Validate object
        validateObject(req.body)
            .then(_ => next())
            .catch(err => {
                res.status(err.code).send({
                    message: err.message
                });
            });
    }

    //Validates an object
    function validateObject(obj) {

        return new Promise((outerResolve, outerReject) => {

            //If one of these properties is left out
            //Then the input is an invalid many to many row
            if (obj.challenge_id === undefined || obj.category_id === undefined) {

                //Generate semantic error message
                if (obj.challenge_id === undefined && obj.category_id === undefined) {
                    var missing = 'challenge_id and category_id';
                } else if (obj.category_id === undefined) {
                    var missing = 'category_id';
                } else {
                    var missing = 'challenge_id';
                }

                outerReject({
                    code: 422,
                    message: `The request must contain ${missing}`
                });

            } else {

                //For each property
                const propertyChecks = Object.keys(obj).map(key => {

                    return new Promise(async (innerResolve, innerReject) => {

                        //Check if the property is in the list of valid properties
                        const validProperties = ['challenge_id', 'category_id'];
                        if (!validProperties.includes(key)) {
                            innerReject({
                                code: 422,
                                message: `The request body can not contain ${key}`
                            });

                        }

                        //Else run challenge_id specific checks
                        else if (key === 'challenge_id') {

                            //Make sure it's an integer
                            if (!validate.isInteger(obj[key])) {

                                innerReject({
                                    code: 422,
                                    message: `${key} must be an integer`
                                });
                            }

                            //Make sure the category exists
                            else if (!await validate.existsWhere('challenges', {
                                    id: obj[key]
                                })) {

                                innerReject({
                                    code: 422,
                                    message: `${obj[key]} is not a valid challenge id`
                                });
                            }

                        }

                        //Else run category_id specific checks
                        else if (key === 'category_id') {

                            //Make sure it's an integer
                            if (!validate.isInteger(obj[key])) {

                                innerReject({
                                    code: 422,
                                    message: `${key} must be an integer`
                                });
                            }
                            //Make sure the category exists
                            else if (!await validate.existsWhere('categories', {
                                    id: obj[key]
                                })) {

                                innerReject({
                                    code: 422,
                                    message: `${obj[key]} is not a valid category id`
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
}

const get = (req, res, next) => {

    //Validate object
    validateObject(req.query)
        .then(_ => next())
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
                    const validProperties = ['challenges'];
                    if (!validProperties.includes(key)) {
                        innerReject({
                            code: 422,
                            message: `The request body can not contain ${key}`
                        });
                    }

                    //Else run challenges specific checks
                    else if (key === 'challenges') {

                        //Make sure it's a boolean
                        if (!validate.isBoolean(obj[key])) {

                            innerReject({
                                code: 422,
                                message: `${key} must be an boolean`
                            });
                        }

                        //Convert the query param string to a boolean
                        //Overwrite the request object value
                        obj[key] = validate.convertBoolean(obj[key]);
                        req.query[key] = obj[key];
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
}

module.exports = {
    get,
    post
}