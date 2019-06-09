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
//     dataType: String ('boolean' || 'string' || 'number' | 'id')
//     dbTable: String ('users' || 'categories' || 'challenges' || 'user_submissions' || 'challenges_categories')
//     protected: Boolean
//     unique: Boolean
// }

//Curry the Validation Schema to the actual custom middleware function
module.exports = function validateUserInput(validationSchema) {

    
    //Returns Express middleware
    return (req, res, next) => {
        
        //Boolean toggles off if input is invalid
        let valid = true;

        //If the proper validationSchema type was not submitted to the middleware
        if (!validationSchema instanceof Array) {

            //Then the validationSchema is misconfigured
            //Return an internal server error
            res.status(500).send({
                message: 'Internal Server Error'
            });
            //Toggle to invalid
            valid = false;
        }

        //Else a Validation Schema was sent to the middleware
        else {

            //For each schema entry
            for (let i = 0; i < validationSchema.length && valid; i++) {

                //Grab the current validation object
                const validationObject = validationSchema[i];

                //Some query/body/params properties are optional
                //If the property required but undefined
                //And it does not have a default value
                if (req[validationObject.type][validationObject.name] === undefined && validationObject.required && validationObject.default === undefined) {
                    res.status(422).send({
                        message: `${validationObject.name} is required`
                    });
                    //Toggle to invalid
                    valid = false;
                }

                //If the property does not exist on the query/body/params
                //And it has a default specified in the validationObject
                //Then set its value equal to the default
                else if (req[validationObject.type][validationObject.name] === undefined && validationObject.default !== undefined) {

                    //If dataType is an ID of a database table entry
                    if (validationObject.dataType === 'id') {

                        const applicableDbApi = dbTableSwitch(validationObject.dbTable);

                        //Fetch it from the proper table
                        applicableDbApi.getOne({
                                id: validationObject.default
                            })
                            .then(item => {

                                //If it doesn't exist...
                                if (item === undefined) {

                                    //Defaults should never not exist in the database
                                    //If it occurs then the validationSchema is incorrect
                                    //Log the error to the console and return internal server error
                                    console.log(`The default validationObject specified as ${validationObject.name} in ${validationObject.dbTable} does not exist in the database`);
                                    res.status(500).send({
                                        message: `Internal Server Error`
                                    });
                                    valid = false;
                                }

                                //Else If it does exist:
                                //Make sure it is they own the resource
                                //If it is a protected resource and the user is not an admin
                                else if (validationObject.protected && req.headers.user.role !== 'admin') {

                                    //If it's on the user table
                                    if (validationObject.dbTable) {

                                        //Then make sure their user id matches the id sent by the request
                                        if (req.headers.user.id !== item.id) {
                                            res.status(403).send({
                                                message: `Not Authorized`
                                            });
                                            valid = false;
                                        }
                                    }

                                    //Else their id should be in created_by
                                    //Make sure they own the document
                                    else {

                                        //Make sure their user id matches the created_by column
                                        if (req.headers.user.id !== item.created_by) {
                                            res.status(403).send({
                                                message: `Not Authorized`
                                            });
                                            valid = false;
                                        }
                                    }
                                }
                            });
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
                    if ((typeof req[validationObject.type][validationObject.name] !== validationObject.dataType && validationObject.dataType !== 'id') ||
                        (typeof req[validationObject.type][validationObject.name] !== 'number' && validationObject.dataType === 'id')) {
                        res.status(422).send({
                            message: `${validationObject.name} must be a ${validationObject.dataType}`
                        });
                        valid = false;
                    }

                    //If it is an id
                    //If dataType is an ID of a database table entry
                    if (validationObject.dataType === 'id') {

                        //Get the applicable database API
                        const applicableDbApi = dbTableSwitch(validationObject.dbTable);

                        //Fetch it from the proper table
                        applicableDbApi.getOne({
                                id: req[validationObject.type].id
                            })
                            .then(item => {

                                //If it doesn't exist...
                                if (item === undefined) {

                                    //Then throw an error
                                    res.status(422).send({
                                        message: `${validationObject.name} in ${validationObject.dbTable} does not exist in the database`
                                    });
                                    valid = false;
                                }

                                //Else If it does exist:
                                //Make sure it is they own the resource
                                //If it is a protected resource and not an admin
                                else if (validationObject.protected && req.headers.user.role !== 'admin') {

                                    //If it's on the user table
                                    if (validationObject.dbTable) {

                                        //Then make sure their user id matches the id sent by the request
                                        if (req.headers.user.id !== item.id) {
                                            res.status(403).send({
                                                message: `Not Authorized`
                                            });
                                            valid = false;
                                        }
                                    }

                                    //Else their id should be in created_by
                                    //Make sure they own the document
                                    else {

                                        //Make sure their user id matches the created_by column
                                        if (req.headers.user.id !== item.created_by) {
                                            res.status(403).send({
                                                message: `Not Authorized`
                                            });
                                            valid = false;
                                        }
                                    }
                                }
                            });

                    }

                    //Else If it's a protected resource and the user is not an admin
                    //Then force the query/param/body property to the default
                    else if (validationObject.protected && req.headers.user.role !== 'admin') {
                        req[validationObject.type][validationObject.name] = validationObject.default;
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

                            //If it doesn't exist then throw an error
                            if (!foundKey) {
                                res.status(422).send({
                                    message: `Including ${key} in the ${type} invalidates your request`
                                });
                                valid = false;
                            }

                            //Else if they sent a duplicate key then throw an error
                            else {

                                //Remove the key from the array of keys
                                const tempKeys = keys.splice(index, 0);

                                //Look for a duplicate key in the keys array
                                const duplicateKey = tempKeys.find(anotherKey => anotherKey === key);

                                //If found then throw an error
                                if (duplicateKey) {
                                    res.status(422).send({
                                        message: `Including two ${key}s invalidates your request`
                                    });
                                    valid = false;
                                }
                            }
                        });
                    }
                }

            })
        }

        //If the request is determined to be valid
        //Then continue to process the request
        if (valid) {
            next();
        }

    };
}

//Used to return a dynamic database API depending on the table name
function dbTableSwitch(table) {
    switch(table) {
        case 'categories': return categories; 
        case 'challenges_categories': return challenges_categories;
        case 'challenges': return challenges;
        case 'user_submissions': return user_submissions;
        case 'users': return users; 
    }
}