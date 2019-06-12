const categories = require('../apis/db/categories');
const challenges_categories = require('../apis/db/challengesCategories');
const challenges = require('../apis/db/challenges');
const user_submissions = require('../apis/db/userSubmissions');
const users = require('../apis/db/users');

// Validation Schema
// Accepts an array of objects
// Each object has a schema
// Example validationSchema Array Item:
// {
//     name: String
//     required: Boolean
//     type: String ('query' || 'body' || 'params')
//     default: Boolean || String || Number
//     dataType: String ('boolean' || 'string' || 'number' || 'id' || 'range')
//     dbTable: String ('users' || 'categories' || 'challenges' || 'user_submissions' || 'challenges_categories')
//     protected: Boolean
//     unique: Boolean
//     range: [min, max]
// }

//Curry the Validation Schema to the actual custom middleware function
module.exports = function validateUserInput(validationSchema) {

    //Returns Express middleware
    return (req, res, next) => {

        //Start an asynchronous Promise then chain
        //If the user input is invalid
        //Then an error will be thrown after an error response is sent.
        Promise.resolve()

            .then(async _ => {

                //If the proper validationSchema type was not submitted to the middleware
                if (!validationSchema instanceof Array) {

                    //Then the validationSchema is misconfigured
                    //Return an internal server error
                    return {
                        errorType: 'default'
                    };
                }

                //For each schema entry
                for (let i = 0; i < validationSchema.length; i++) {

                    //Grab the current validation object
                    const validationObject = validationSchema[i];

                    //Some query/body/params properties are optional
                    //If the property required but undefined
                    //And it does not have a default value
                    if (req[validationObject.type][validationObject.name] === undefined && validationObject.required && validationObject.default === undefined) {

                        return {
                            errorType: 'required',
                            errorName: validationObject.name
                        };
                    }

                    //If the property does not exist on the query/body/params
                    //And it has a default specified in the validationObject
                    //Then set its value equal to the default
                    else if (req[validationObject.type][validationObject.name] === undefined && validationObject.default !== undefined) {

                        //If dataType is an ID of a database table entry
                        if (validationObject.dataType === 'id') {

                            //Get the applicable database API
                            const applicableDbApi = dbTableSwitch(validationObject.dbTable);

                            //Fetch it from the proper table
                            const item = await applicableDbApi.getOne({
                                id: validationObject.default
                            });

                            //If it doesn't exist...
                            if (item === undefined) {

                                //Defaults should never not exist in the database
                                //If it occurs then the validationSchema is incorrect
                                //Log the error to the console and return internal server error
                                console.log(`The default validationObject specified as ${validationObject.name} in ${validationObject.dbTable} does not exist in the database`);
                                return {
                                    errorType: 'default'
                                };
                            }

                            //Else If it does exist:
                            //Make sure it is they own the resource
                            //If it is a protected resource and the user is not an admin
                            else if (validationObject.protected && req.headers.user.role !== 'admin') {

                                //If it's on the user table
                                if (validationObject.dbTable) {

                                    //Then make sure their user id matches the id sent by the request
                                    if (req.headers.user.id !== item.id) {
                                        return {
                                            errorType: 'protected'
                                        };
                                    }
                                }

                                //Else their id should be in created_by
                                //Make sure they own the document
                                else {

                                    //Make sure their user id matches the created_by column
                                    if (req.headers.user.id !== item.created_by) {
                                        return {
                                            errorType: 'protected'
                                        };
                                    }
                                }
                            }
                        }

                        //Else, the default is already in the proper format so it can be assigned
                        else {
                            req[validationObject.type][validationObject.name] = validationObject.default;
                        }
                    }

                    //If we get to this point one of these is true:
                    //1. If the property exists on the query/body
                    //2. The property does not exist, is not required, and does not have a default
                    //  2a. So we don't need to do anything...

                    //If the property exists on the query/body
                    //Then validate its value
                    else if (req[validationObject.type][validationObject.name] !== undefined) {

                        //Check it's the proper data type
                        if ((typeof req[validationObject.type][validationObject.name] !== validationObject.dataType && validationObject.dataType !== 'id' && validationObject.dataType !== 'range') ||
                            (typeof req[validationObject.type][validationObject.name] !== 'number' && validationObject.dataType === 'id') ||
                            (typeof req[validationObject.type][validationObject.name] !== 'string' && validationObject.dataType === 'range') ||
                            (validationObject.dataType === 'range' && req[validationObject.type][validationObject.name].split('-').reduce((prev, curr) => {
                                return isNaN(Number(curr)) ? true : prev;
                            }, false))) {

                            return {
                                errorType: 'data-type',
                                errorName: validationObject.name,
                                errorDataType: validationObject.dataType
                            };
                        }

                        //If it is an id
                        //If dataType is an ID of a database table entry
                        if (validationObject.dataType === 'id') {

                            //Get the applicable database API
                            const applicableDbApi = dbTableSwitch(validationObject.dbTable);

                            //Fetch it from the proper table
                            const item = await applicableDbApi.getOne({
                                id: req[validationObject.type].id
                            });

                            //If it doesn't exist...
                            if (item === undefined) {

                                //Then throw an error
                                return {
                                    errorType: 'invalid-id',
                                    errorName: validationObject.name,
                                    errorDbTable: validationObject.dbTable
                                };
                            }

                            //Else If it does exist:
                            //Make sure it is they own the resource
                            //If it is a protected resource and not an admin
                            else if (validationObject.protected && req.headers.user.role !== 'admin') {

                                //If it's on the user table
                                if (validationObject.dbTable === 'users') {

                                    //Then make sure their user id matches the id sent by the request
                                    if (req.headers.user.id !== item.id) {

                                        //If not then throw an error
                                        return {
                                            errorType: 'protected'
                                        };
                                    }
                                }

                                //Else their id should be in created_by
                                //Make sure they own the document
                                else {

                                    //Make sure their user id matches the created_by column
                                    if (req.headers.user.id !== item.created_by) {

                                        //If not then throw an error
                                        return {
                                            errorType: 'protected'
                                        };
                                    }
                                }
                            }
                        }

                        //If the dataType is a range
                        //And the range limit is specified
                        else if (validationObject.dataType === 'range' && validationObject.range !== undefined) {

                            //Convert range values from string form to an array of numbers
                            const rangeValues = req[validationObject.type][validationObject.name].split('-').map(str => Number(str));

                            //If the array contains a number below the minimum
                            //If the array contains a number above the maximum
                            if (rangeValues[0] < validationObject.range[0] || rangeValues[1] < validationObject.range[0] ||
                                rangeValues[0] > validationObject.range[1] || rangeValues[1] > validationObject.range[1]) {

                                //Then throw an error
                                return {
                                    errorType: 'out-of-range',
                                    errorRange: req[validationObject.type][validationObject.name],
                                    errorLimit: JSON.stringify(validationObject.range)
                                };
                            }
                        }

                        //If it's a protected resource and the user is not an admin
                        //Then force the query/param/body property to the default
                        if (validationObject.protected !== undefined && validationObject.protected && req.headers.user.role !== 'admin') {
                            req[validationObject.type][validationObject.name] = validationObject.default;
                        }

                        //If it's a unique property
                        //Then make sure it doesn't already exist
                        if (validationObject.unique !== undefined && validationObject.unique) {

                            //Get the applicable database API
                            const applicableDbApi = dbTableSwitch(validationObject.dbTable);

                            const filter = {};
                            filter[validationObject.name] = req[validationObject.type][validationObject.name];

                            //Fetch it from the proper table
                            const item = await applicableDbApi.getOne(filter);

                            //If it already exists...
                            if (item !== undefined) {

                                //If not then throw an error
                                //Then throw an error because it's supposed to be unique
                                return {
                                    errorType: 'unique',
                                    errorName: validationObject.name,
                                    errorDbTable: validationObject.dbTable
                                };
                            }
                        }
                    }

                }

                //After it is confirmed that the validationSchema is valid
                //Make sure no extra user inputs are passed that can cause unexpected bugs and vulnerabilities
                //And make sure user input values were not duplicated in the request

                //For each user input type
                const userInputTypes = ['query', 'params', 'body'];
                userInputTypes.forEach(type => {

                    //Some request types will be undefined
                    //Like body on a GET request
                    if (req[type] !== undefined) {

                        //Get the keys of the object that represents the request for that specific input type
                        const keys = Object.keys(req[type]);

                        //Only If there's any keys in the request type
                        if (keys.length >= 1) {

                            //Iterate through each key
                            keys.forEach((key, index) => {

                                //Look for the key in the validationSchema
                                const foundKey = validationSchema.find(schemaObject => schemaObject.type === type && schemaObject.name === key);

                                //If it doesn't exist then throw an error..
                                if (!foundKey) {

                                    //Including invalid properties (properties not included in the validation schema)
                                    //On a request object could cause unintended consequences
                                    return {
                                        errorType: 'invalid-param',
                                        errorKey: key,
                                        errorParamType: type
                                    };

                                }

                                //Else if they sent a duplicate key then throw an error
                                else {

                                    //Remove the key from the array of keys
                                    const tempKeys = keys.splice(index, 0);

                                    //Look for a duplicate key in the keys array
                                    const duplicateKey = tempKeys.find(anotherKey => anotherKey === key);

                                    //If found then throw an error
                                    if (duplicateKey) {

                                        return {
                                            errorType: 'duplicate-param',
                                            errorKey: key,
                                            errorParamType: type
                                        };
                                    }
                                }
                            });
                        }
                    }

                });
            })
            .then(err => {

                //An error response was already sent to the client
                //So we don't need to do anything here
                //You could add some logging if you want.
                if (err !== undefined) {

                    switch (err.errorType) {
                        case 'required':
                            res.status(422).send({
                                message: `${err.errorName} is required`
                            });
                            break;
                        case 'protected':
                            res.status(403).send({
                                message: `Not Authorized`
                            });
                            break;
                        case 'data-type':
                            res.status(422).send({
                                message: `${err.errorName} must be a ${err.dataType}`
                            });
                            break;
                        case 'invalid-id':
                            res.status(422).send({
                                message: `${err.errorName} in ${err.errorDbTable} does not exist in the database`
                            });
                            break;
                        case 'unique':
                            res.status(422).send({
                                message: `${err.errorName} in ${err.errorDbTable} is not unique`
                            });
                            break;
                        case 'invalid-param':
                            res.status(422).send({
                                message: `Including ${err.errorKey} in the ${err.errorParamType} invalidates your request`
                            });
                            break;
                        case 'duplicate-param':
                            res.status(422).send({
                                message: `Including two ${err.errorKey} ${err.errorParamType} invalidates your request`
                            });
                            break;
                        case 'out-of-range':
                            res.status(422).send({
                                message: `Range ${err.errorRange} is outside of range limit ${err.errorLimit}`
                            });
                            break;
                        default:
                            res.status(500).send({
                                message: 'Internal Server Error'
                            });
                            break;
                    }

                } else {

                    //If we get to this point in the Promise chain and there are no errors
                    //Then the request has been determined to be valid, so we call next()
                    next();
                }

            });
    };
}

//Helper function used throughout middleware
//Used to return a dynamic database API depending on the table name
function dbTableSwitch(table) {
    switch (table) {
        case 'categories':
            return categories;
        case 'challenges_categories':
            return challenges_categories;
        case 'challenges':
            return challenges;
        case 'user_submissions':
            return user_submissions;
        case 'users':
            return users;
    }
}