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
//     dataType: String ('boolean' || 'string' || 'number' || 'id' || 'range' || 'json')
//     range: [min, max]
//     dbTable: String ('users' || 'categories' || 'challenges' || 'user_submissions' || 'challenges_categories')
//     dbProtected: Boolean
//     dbHooks: Object Literal with key (database column to be altered) value (String with code ran through eval()) pairs.
//     dbUnique: Boolean
//     dbUniqueWhere: Object Literal with key (column to match) value (value to match as a String to be parsed through eval()) using a knex .where()
//     evals: Array of Strings (each String is code to be executed via eval() - used for more customized rules
// }

//Curry the Validation Schema to the actual custom middleware function
module.exports = function validateUserInput(validationSchema) {

    //Returns Express middleware
    return (req, res, next) => {

        //Start an asynchronous Promise then chain
        //If the user input is invalid
        //Then an error will be thrown after an error response is sent.
        Promise.resolve()

            .then(_ => {
                return checkValidationSchema();
            })
            .then(_ => {
                return checkForExtraInputs();
            })
            .then(async _ => {
                const validationObjectChecks = validationSchema.map(validationObject => {
                    return checkValidationObject(validationObject);
                });

                return Promise.all(validationObjectChecks);
            })
            .then(_ => {
                next();
            })
            .catch(err => {
                switch (err.errorType) {
                    case 'required':
                        res.status(422).send({
                            message: `${err.errorName} is required`
                        });
                        break;
                    case 'unauthorized':
                        res.status(403).send({
                            message: `Not Authorized`
                        });
                        break;
                    case 'data-type':
                        res.status(422).send({
                            message: `${err.errorName} must be a ${err.errorDataType}`
                        });
                        break;
                    case 'invalid-id':
                        res.status(422).send({
                            message: `${err.errorName} in ${err.errorDbTable} table does not exist in the database`
                        });
                        break;
                    case 'db-unique':
                        res.status(422).send({
                            message: `${err.errorName} in ${err.errorDbTable} table is not unique`
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
                    case 'no-value':
                        res.status(422).send({
                            message: `${err.errorName} was passed without any value`
                        });
                        break;
                    case 'exceeds-limits':
                        res.status(422).send({
                            message: `${err.errorName} is outside of the range specified: ${err.errorLimits}`
                        });
                        break;
                    case 'already-completed':
                        res.status(422).send({
                            message: `This challenge was already completed. Reset the submission first to re-attempt it.`
                        });
                        break;
                    default:
                        res.status(500).send({
                            message: 'Internal Server Error'
                        });
                        break;
                }

            });

        //Make sure the Validation Schema is valid
        function checkValidationSchema() {

            //If the proper validationSchema type was not submitted to the middleware
            if (!validationSchema instanceof Array) {

                console.log('Internal Error checkValidationSchema()')
                //Then the validationSchema is misconfigured
                //Return an internal server error
                throw {
                    errorType: 'default'
                };
            }
        }

        //Make sure no extra user inputs are passed that can cause unexpected bugs and vulnerabilities
        function checkForExtraInputs() {

            //For each user input type
            const userInputTypes = ['query', 'params', 'body'];
            userInputTypes.forEach(type => {

                //Some request types will be undefined
                //IE. a body on a GET request or params on a POST
                if (req[type] !== undefined) {

                    //Get the keys of the object that represents the request for that specific input type
                    const keys = Object.keys(req[type]);

                    //Only If there's any keys in the request type
                    if (keys.length >= 1) {

                        //Iterate through each key
                        keys.forEach((key, index) => {

                            //Look for the key in the validationSchema
                            const foundKey = validationSchema.find(schemaObject => schemaObject.type === type && schemaObject.name === key);

                            //If the key doesn't exist in the validationSchema then throw an error..
                            if (foundKey === undefined) {

                                //Including invalid properties (properties not included in the validation schema)
                                //On a request object could cause unintended consequences
                                throw {
                                    errorType: 'invalid-param',
                                    errorKey: key,
                                    errorParamType: type
                                };
                            }
                        });
                    }
                }

            });
        }

        async function checkValidationObject(validationObject) {

            const allChecks = [];

            //Some query/body/params properties are optional
            //If the property required but undefined
            if (req[validationObject.type][validationObject.name] === undefined && validationObject.required) {

                throw {
                    errorType: 'required',
                    errorName: validationObject.name
                };
            }

            //Since it's not required, only do further validation if it exists
            else if (req[validationObject.type][validationObject.name] !== undefined) {
                allChecks.push(dataTypeSpecificChecks(validationObject));
            }

            //Check uniqueness rules
            allChecks.push(checkUniqueness(validationObject))

            //Run evals
            allChecks.push(parseEvals(validationObject))

            return Promise.all(allChecks);
        }

        function dataTypeSpecificChecks(validationObject) {

            switch (validationObject.dataType) {
                case 'id':
                    return idChecks();
                case 'range':
                    return rangeChecks();
                case 'number':
                    return numberChecks();
                case 'boolean':
                    return booleanChecks();
                case 'string':
                    return stringChecks();
                case 'json':
                    return jsonChecks();
                case 'range':
                    return rangeChecks();
                default:
                    return;
            }

            async function idChecks() {

                //If the ID is not a number, and not able to be converted into a number
                if (typeof req[validationObject.type][validationObject.name] !== 'number' && isNaN(Number(req[validationObject.type][validationObject.name]))) {

                    //Then throw an error because it is of an invalid data type
                    throw {
                        errorType: 'data-type',
                        errorName: validationObject.name,
                        errorDataType: validationObject.dataType
                    };

                } else {

                    //Get the applicable database API
                    const applicableDbApi = dbTableSwitch(validationObject.dbTable);

                    //Fetch it from the proper table
                    const item = await applicableDbApi.getOne({
                        id: req[validationObject.type][validationObject.name]
                    });

                    //If the row doesn't exist
                    if (item === undefined) {

                        //Then throw an error
                        throw {
                            errorType: 'invalid-id',
                            errorName: validationObject.name,
                            errorDbTable: validationObject.dbTable
                        };
                    }

                    //Else if it does exist
                    else {

                        //Make sure they own the resource
                        //If it is a protected resource and not an admin
                        if (validationObject.dbProtected && req.headers.user.role !== 'admin') {

                            //If it's on the user table
                            if (validationObject.dbTable === 'users') {

                                //Then make sure their user id matches the id sent by the request
                                if (req.headers.user.id !== item.id) {

                                    //If not then throw an error
                                    throw {
                                        errorType: 'unauthorized'
                                    };
                                }
                            }

                            //Else their id should be in created_by
                            //Make sure they own the document
                            else {

                                //Make sure their user id matches the created_by column
                                if (req.headers.user.id !== item.created_by) {

                                    //If not then throw an error
                                    throw {
                                        errorType: 'unauthorized'
                                    };
                                }
                            }
                        }



                        //If there's a database hook rule
                        if (validationObject.dbHooks !== undefined) {

                            //For each property that has a hook
                            Object.keys(validationObject.dbHooks).forEach(async key => {

                                //If the database hook involves a value in the database
                                //And the column on the same row and table as already stored in the const item
                                //Then the value of the key in the dbHook will be in string form
                                if (typeof validationObject.dbHooks[key] !== 'object') {
                                    req[validationObject.type][key] = eval(`${validationObject.dbHooks[key]}`);
                                }

                                //Else it's on another table or another row, so we need to query for it.
                                else {

                                    //Get the applicable database API using the table property
                                    const altDbApi = dbTableSwitch(validationObject.dbHooks[key].table);

                                    //Setup an empty filter
                                    const filter = {};

                                    //Loop over the keys on the dbHook where Object Literal aka. db query filter
                                    Object.keys(validationObject.dbHooks[key].where).forEach(filterItem => {

                                        //Process each filter param through eval
                                        //This way where filter params can refer to the db item already found
                                        //Which is store in the const item variable
                                        filter[filterItem] = eval(validationObject.dbHooks[key].where[filterItem]);
                                    });

                                    console.log('right before')

                                    //Fetch the item using the where() filter property
                                    const hookItem = await altDbApi.getOne(filter);

                                    console.log('too late', hookItem)

                                    //Assign the value of the eval property
                                    req[validationObject.type][key] = eval(` ${validationObject.dbHooks[key].eval}`);

                                    console.log(key, req[validationObject.type][key])
                                }
                            });
                        }
                    }
                }
            }

            function rangeChecks() {

                //If it's a number or boolean
                if (typeof req[validationObject.type][validationObject.name] === 'number' ||
                    typeof req[validationObject.type][validationObject.name] === 'boolean') {

                    //Then throw an error because it is of an invalid data type
                    //Ranges can only be expressed in string or array formay
                    throw {
                        errorType: 'data-type',
                        errorName: validationObject.name,
                        errorDataType: validationObject.dataType
                    };
                }

                //Else If the range is not a string or an array, or an array with two values
                else if ((typeof req[validationObject.type][validationObject.name] !== 'string' &&
                        req[validationObject.type][validationObject.name].length === undefined) &&
                    (req[validationObject.type][validationObject.name].length !== undefined &&
                        req[validationObject.type][validationObject.name].length !== 2)) {

                    //Then throw an error because it is of an invalid data type
                    throw {
                        errorType: 'data-type',
                        errorName: validationObject.name,
                        errorDataType: validationObject.dataType
                    };

                }

                //Else if it's a string
                //AND the string can not be split into two numbers delimited by a dash
                else if (typeof req[validationObject.type][validationObject.name] === 'string' &&
                    req[validationObject.type][validationObject.name].split('-').reduce((prev, curr) => {
                        return isNaN(Number(curr)) ? true : prev;
                    }, false)) {

                    //Then throw an error because it is of an invalid data type
                    throw {
                        errorType: 'data-type',
                        errorName: validationObject.name,
                        errorDataType: validationObject.dataType
                    };

                }

                //If a range limit is set in the schema
                if (validationObject.range !== undefined) {

                    //Convert range values from string form to an array of numbers
                    const rangeValues = req[validationObject.type][validationObject.name].split('-').map(str => Number(str));

                    //If the array contains a number below the minimum
                    //If the array contains a number above the maximum
                    if (rangeValues[0] < validationObject.range[0] || rangeValues[1] < validationObject.range[0] ||
                        rangeValues[0] > validationObject.range[1] || rangeValues[1] > validationObject.range[1]) {

                        //Then throw an error
                        throw {
                            errorType: 'out-of-range',
                            errorRange: req[validationObject.type][validationObject.name],
                            errorLimit: JSON.stringify(validationObject.range)
                        };
                    }
                }
            }

            function numberChecks() {

                //If it's not a number via typeof then subject it to more tests
                if (typeof req[validationObject.type][validationObject.name] !== 'number') {

                    //If it's a boolean then it's not a number
                    //This test is needed in addition to isNaN(Number(value))
                    //Due to type coercion Number(boolean) convers to 1 || 0
                    if (typeof req[validationObject.type][validationObject.name] === 'boolean') {

                        //Then throw an error
                        throw {
                            errorType: 'data-type',
                            errorName: validationObject.name,
                            errorDataType: validationObject.dataType
                        };
                    }

                    //If the value can not be converted into a number via type conversion
                    else if (isNaN(Number(req[validationObject.type][validationObject.name]))) {

                        //Then throw an error
                        throw {
                            errorType: 'data-type',
                            errorName: validationObject.name,
                            errorDataType: validationObject.dataType
                        };
                    }

                    //Otherwise, it's supposed to be an number
                    //And can be converted into an number
                    //So convert it into a number
                    else {
                        req[validationObject.type][validationObject.name] = Number(req[validationObject.type][validationObject.name]);

                        //If it has a range set, check that it's within the range
                        if (validationObject.range !== undefined) {

                            //If it's outside the limits
                            if (req[validationObject.type][validationObject.name] < validationObject.range[0] ||
                                req[validationObject.type][validationObject.name] > validationObject.range[1]) {

                                //Then throw an error
                                throw {
                                    errorType: 'exceeds-limits',
                                    errorName: validationObject.name,
                                    errorLimits: JSON.stringify(validationObject.range)
                                };
                            }
                        }
                    }
                }

                //Else it had already been confirmed as a number
                //If it has a range set, check that it's within the range
                else if (validationObject.range !== undefined) {

                    //If it's outside the limits
                    if (req[validationObject.type][validationObject.name] < validationObject.range[0] ||
                        req[validationObject.type][validationObject.name] > validationObject.range[1]) {

                        //Then throw an error
                        throw {
                            errorType: 'exceeds-limits',
                            errorName: validationObject.name,
                            errorLimits: JSON.stringify(validationObject.range)
                        };
                    }
                }

            }

            function booleanChecks() {

                //If the typeof is not a boolean, string, or number then it's not of a proper boolean value
                if (typeof req[validationObject.type][validationObject.name] !== 'boolean' &&
                    typeof req[validationObject.type][validationObject.name] !== 'string' &&
                    typeof req[validationObject.type][validationObject.name] !== 'number') {

                    //Then throw an error
                    throw {
                        errorType: 'data-type',
                        errorName: validationObject.name,
                        errorDataType: validationObject.dataType
                    };
                }

                //Else if it's not a boolean but actually a string
                else if (typeof req[validationObject.type][validationObject.name] === 'string') {

                    //Check if it is a boolean in string format
                    if (req[validationObject.type][validationObject.name].toLowerCase() === 'true' ||
                        req[validationObject.type][validationObject.name].toLowerCase() === 'false' ||
                        req[validationObject.type][validationObject.name].toLowerCase() === '0' ||
                        req[validationObject.type][validationObject.name].toLowerCase() === '1') {

                        //Ensure boolean string is in lowercase format
                        req[validationObject.type][validationObject.name] = req[validationObject.type][validationObject.name].toLowerCase();

                        //Use an equality operator to convert into a proper boolean value
                        req[validationObject.type][validationObject.name] = (req[validationObject.type][validationObject.name] === 'true' || req[validationObject.type][validationObject.name] === '1');
                    }

                    //Else the string is not a boolean
                    else {

                        //Then throw an error
                        throw {
                            errorType: 'data-type',
                            errorName: validationObject.name,
                            errorDataType: validationObject.dataType
                        };
                    }
                }

                //Else if it's not a boolean but actually a number
                else if (typeof req[validationObject.type][validationObject.name] === 'number') {

                    //If it's a boolean in number format (aka a binary 1 or 0)
                    if (req[validationObject.type][validationObject.name] === 0 ||
                        req[validationObject.type][validationObject.name] === 1) {

                        //Then use an equality operator to convert it into a boolean
                        req[validationObject.type][validationObject.name] = (req[validationObject.type][validationObject.name] === 1);
                    }

                    //Else since the number provided is not a boolean
                    else {

                        //Then throw an error
                        throw {
                            errorType: 'data-type',
                            errorName: validationObject.name,
                            errorDataType: validationObject.dataType
                        };
                    }
                }
            }

            function stringChecks() {

                if (typeof req[validationObject.type][validationObject.name] !== 'string') {

                    //Then throw an error
                    throw {
                        errorType: 'data-type',
                        errorName: validationObject.name,
                        errorDataType: validationObject.dataType
                    };
                }

            }

            function jsonChecks() {

                //IF typeof is not a string and not an object
                //Then it's not json
                //(json will be a string if stringified beforehand)
                if (typeof req[validationObject.type][validationObject.name] !== 'string' &&
                    typeof req[validationObject.type][validationObject.name] !== 'object') {

                    //Then throw an error
                    throw {
                        errorType: 'data-type',
                        errorName: validationObject.name,
                        errorDataType: validationObject.dataType
                    };
                }

                //If it's an object or array, then convert it into json
                else if (typeof req[validationObject.type][validationObject.name] === 'object') {

                    req[validationObject.type][validationObject.name] = JSON.stringify(req[validationObject.type][validationObject.name]);

                }

                //Else it's already a string then it doesn't need to be stringified
                //But verify it is valid JSON
                else {
                    try {
                        JSON.parse(req[validationObject.type][validationObject.name]);
                    } catch (err) {
                        throw {
                            errorType: 'invalid-json',
                            errorName: validationObject.name,
                            errorDataType: validationObject.dataType
                        };
                    }
                }
            }

            function rangeChecks() {

                //Convert range values from string form to an array of numbers
                const rangeValues = req[validationObject.type][validationObject.name].split('-').map(str => Number(str));

                //If the array contains a number below the minimum
                //If the array contains a number above the maximum
                if (rangeValues[0] < validationObject.range[0] || rangeValues[1] < validationObject.range[0] ||
                    rangeValues[0] > validationObject.range[1] || rangeValues[1] > validationObject.range[1]) {

                    //Then throw an error
                    throw {
                        errorType: 'out-of-range',
                        errorRange: req[validationObject.type][validationObject.name],
                        errorLimit: JSON.stringify(validationObject.range)
                    };
                }
            }
        }

        async function checkUniqueness(validationObject) {

            //If it's a unique property
            //Then make sure it doesn't already exist
            if ((validationObject.dbUnique !== undefined && validationObject.dbUnique) || validationObject.dbUniqueWhere !== undefined) {

                //Get the applicable database API
                const applicableDbApi = dbTableSwitch(validationObject.dbTable);

                //Create empty filter
                const filter = {};

                //Apply param/body/query parameter value to query if not undefined
                if (req[validationObject.type][validationObject.name] !== undefined) {
                    filter[validationObject.name] = req[validationObject.type][validationObject.name];
                }

                //If there are additional key/value pairs that go into the filter defined by uniqueWhere
                if (validationObject.dbUniqueWhere !== undefined) {

                    //Add each additional filter
                    Object.keys(validationObject.dbUniqueWhere).forEach(key => {
                        filter[key] = eval(validationObject.dbUniqueWhere[key]);
                    });
                }

                //Fetch from the proper table
                const item = await applicableDbApi.getOne(filter);

                //If the row already exists...
                //Throw an error because it's supposed to be unique
                if (item !== undefined) {

                    console.log(filter, item)

                    //If there's a uniqueWhere rule
                    if (validationObject.dbUniqueWhere !== undefined) {

                        //If there's a param named completed in the uniqueWhere
                        //Then the user was trying to submit a submission on an already completed challenge
                        //They need to reset the challenge first
                        if (validationObject.dbUniqueWhere.completed !== undefined) {
                            throw {
                                errorType: 'already-completed'
                            };
                        } else {

                            //Include all columns that are supposed to be unique in the error message
                            throw {
                                errorType: 'db-unique',
                                errorName: Object.keys(filter).join(' and '),
                                errorDbTable: validationObject.dbTable
                            };
                        }


                    }

                    //Else it was a simple unique rule
                    else {
                        throw {
                            errorType: 'db-unique',
                            errorName: validationObject.name,
                            errorDbTable: validationObject.dbTable
                        };
                    }

                }

            }
        }

        function parseEvals(validationObject) {

            //If the validationSchema has evals
            if (validationObject.evals !== undefined) {

                //Error will remain undefined unless set in an eval invocation
                let error;

                //Run each eval string that's defined
                validationObject.evals.forEach(code => {
                    eval(code);
                });

                //If an eval invocation should return an error response
                //Then send it into the error switch
                if (error !== undefined) {
                    throw error;
                }
            }
        }
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