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
//     dataType: String ('boolean' || 'string' || 'number' || 'id' || 'range' || 'json')
//     dbTable: String ('users' || 'categories' || 'challenges' || 'user_submissions' || 'challenges_categories')
//     protected: Boolean
//     unique: Boolean
//     range: [min, max]
// }

// [
//     {
//         if: [
            
//             // Array || Object
//             // Array if multiple comparisons need to be grouped together using a logical operator
//             // Object if a comparison needs to be standalone

//             {
//                 expectedValue: Boolean || String || Number || Array || JSON || undefined || null
//                 expectedValueType: String ('literal' || 'regex')
//                 expectedValueTransformer: String (IE. .length() or .propertyName or .slice(0,1))
//                 comparisonOperator: String ('>' || '>=' || '<' || '<=' || '==' || '===')
//                 logicalOperator: String ('||' || '&&')
//                 paramType: String ('query' || 'body' || 'params' || 'headers')
//                 param: String
//                 expectedDataType: String ('boolean' || 'string' || 'number' || 'array' || 'json' || 'undefined' || 'null')
//                 databaseTable: String ('users' || 'categories' || 'challenges' || 'user_submissions' || 'challenges_categories')
//             }
//         ],
//         then: [
//             {
//                 assignToSameParam: {
//                     paramType: String ('query' || 'body' || 'params' || 'headers')
//                     param: String
//                     value: Boolean || String || Number || Array || JSON || undefined || null
//                 },
//                 assignToNewParam: {
//                     paramType: String ('query' || 'body' || 'params' || 'headers')
//                     param: String
//                     value: Boolean || String || Number || Array || JSON || undefined || null
//                 },
//                 rejectRequest: {
//                     consoleLog: Boolean
//                     throwError: Boolean
//                     errorMessage: String
//                 }
//             }
//         ]
//     }
// ]

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

                //Make sure no extra user inputs are passed that can cause unexpected bugs and vulnerabilities
                //And make sure user input values were not duplicated in the request

                //This variable will toggle from undefined if an error is found
                let error = undefined;

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

                                //If the key doesn't exist in the validationSchema then throw an error..
                                if (foundKey === undefined) {

                                    //Including invalid properties (properties not included in the validation schema)
                                    //On a request object could cause unintended consequences
                                    error = {
                                        errorType: 'invalid-param',
                                        errorKey: key,
                                        errorParamType: type
                                    };
                                }

                                //Else if the key is in the validationSchema
                                else {

                                    //If someone sends a query param but does not specify its value
                                    //It can cause an internal server error
                                    //Check for empty query params and throw an error
                                    if (typeof req[type][key] === 'string' &&
                                        req[type][key].trim() === '') {

                                        //Then throw an error because it is of an invalid data type
                                        //Ranges can only be expressed in string or array formay
                                        error = {
                                            errorType: 'no-value',
                                            errorName: key
                                        };
                                    }

                                    //Else Check for duplicate keys which could cause unintended consequences
                                    else {

                                        //Remove the key from the array of keys
                                        const tempKeys = keys.splice(index, 0);
                                        //Look for a duplicate key in the keys array
                                        const duplicateKey = tempKeys.find(anotherKey => anotherKey === key);

                                        //If found then throw an error
                                        if (duplicateKey) {

                                            error = {
                                                errorType: 'duplicate-param',
                                                errorKey: key,
                                                errorParamType: type
                                            };
                                        }
                                    }

                                }
                            });
                        }
                    }

                });

                if (error !== undefined) {

                    return error;

                } else {

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
<<<<<<< Updated upstream

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

=======

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
>>>>>>> Stashed changes
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

                        //If a property exists exists on the query/body
                        //With the same name as the validationSchema Object
                        //Then validate its value
                        else if (req[validationObject.type][validationObject.name] !== undefined) {

                            //If the dataType is id
                            //If dataType is an ID of a database table entry
                            if (validationObject.dataType === 'id') {

<<<<<<< Updated upstream
=======
                                console.log('id')

>>>>>>> Stashed changes
                                //If it is an ID, Not a number, and not able to be converted into a number
                                if (typeof req[validationObject.type][validationObject.name] !== 'number' && isNaN(Number(req[validationObject.type][validationObject.name]))) {

                                    //Then throw an error because it is of an invalid data type
                                    return {
                                        errorType: 'data-type',
                                        errorName: validationObject.name,
                                        errorDataType: validationObject.dataType
                                    };
                                }

                                //Get the applicable database API
                                const applicableDbApi = dbTableSwitch(validationObject.dbTable);

                                //Fetch it from the proper table
                                const item = await applicableDbApi.getOne({
                                    id: req[validationObject.type][validationObject.name]
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

                                //Else if it does exist
                                //Make sure it is they own the resource
                                //If it is a protected resource and not an admin
                                else if (validationObject.protected && req.headers.user.role !== 'admin') {
<<<<<<< Updated upstream

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

=======

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

>>>>>>> Stashed changes
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
                            else if (validationObject.dataType === 'range') {

                                //If it's a number or boolean
                                if (typeof req[validationObject.type][validationObject.name] === 'number' ||
                                    typeof req[validationObject.type][validationObject.name] === 'boolean') {

                                    //Then throw an error because it is of an invalid data type
                                    //Ranges can only be expressed in string or array formay
                                    return {
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
                                    return {
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
                                    return {
                                        errorType: 'data-type',
                                        errorName: validationObject.name,
                                        errorDataType: validationObject.dataType
                                    };

                                }

                                //If a range limit is set in the schema
                                if (validationObject.range !== undefined) {
<<<<<<< Updated upstream

                                    //Convert range values from string form to an array of numbers
                                    const rangeValues = req[validationObject.type][validationObject.name].split('-').map(str => Number(str));

=======

                                    //Convert range values from string form to an array of numbers
                                    const rangeValues = req[validationObject.type][validationObject.name].split('-').map(str => Number(str));

>>>>>>> Stashed changes
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
                            }

                            //If it's supposed to be of a number dataType
                            //And the typeof does not equal number
                            else if (validationObject.dataType === 'number') {

                                //If it's not a number via typeof then subject it to more tests
                                if (typeof req[validationObject.type][validationObject.name] !== 'number') {

                                    //If it's a boolean then it's not a number
                                    //This test is needed in addition to isNaN(Number(value))
                                    //Due to type coercion Number(boolean) convers to 1 || 0
                                    if (typeof req[validationObject.type][validationObject.name] === 'boolean') {
<<<<<<< Updated upstream

                                        //Then throw an error
                                        return {
                                            errorType: 'data-type',
                                            errorName: validationObject.name,
                                            errorDataType: validationObject.dataType
                                        };
                                    }

                                    //If the value can not be converted into a number via type conversion
                                    else if (isNaN(Number(req[validationObject.type][validationObject.name]))) {

                                        //Then throw an error
                                        return {
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
                                                return {
                                                    errorType: 'exceeds-limits',
                                                    errorName: validationObject.name,
                                                    errorLimits: JSON.stringify(validationObject.range)
                                                };
                                            }
                                        }
                                    }
                                }

=======

                                        //Then throw an error
                                        return {
                                            errorType: 'data-type',
                                            errorName: validationObject.name,
                                            errorDataType: validationObject.dataType
                                        };
                                    }

                                    //If the value can not be converted into a number via type conversion
                                    else if (isNaN(Number(req[validationObject.type][validationObject.name]))) {

                                        //Then throw an error
                                        return {
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
                                            if(req[validationObject.type][validationObject.name] < validationObject.range[0] ||
                                                req[validationObject.type][validationObject.name] > validationObject.range[1]) {
                                                
                                                //Then throw an error
                                                return {
                                                    errorType: 'exceeds-limits',
                                                    errorName: validationObject.name,
                                                    errorLimits: JSON.stringify(validationObject.range)
                                                };
                                            }
                                        }
                                    }
                                }
                                
>>>>>>> Stashed changes
                                //Else it had already been confirmed as a number
                                //If it has a range set, check that it's within the range
                                else if (validationObject.range !== undefined) {

                                    //If it's outside the limits
<<<<<<< Updated upstream
                                    if (req[validationObject.type][validationObject.name] < validationObject.range[0] ||
                                        req[validationObject.type][validationObject.name] > validationObject.range[1]) {

=======
                                    if(req[validationObject.type][validationObject.name] < validationObject.range[0] ||
                                        req[validationObject.type][validationObject.name] > validationObject.range[1]) {
                                        
>>>>>>> Stashed changes
                                        //Then throw an error
                                        return {
                                            errorType: 'exceeds-limits',
                                            errorName: validationObject.name,
                                            errorLimits: JSON.stringify(validationObject.range)
                                        };
                                    }
                                }

                            } else if (validationObject.dataType === 'boolean') {

                                //If the typeof is not a boolean, string, or number then it's not of a proper boolean value
                                if (typeof req[validationObject.type][validationObject.name] !== 'boolean' &&
                                    typeof req[validationObject.type][validationObject.name] !== 'string' &&
                                    typeof req[validationObject.type][validationObject.name] !== 'number') {

                                    //Then throw an error
                                    return {
                                        errorType: 'data-type',
                                        errorName: validationObject.name,
                                        errorDataType: validationObject.dataType
                                    };
                                }

                                //Else if it's not a boolean but actually a string
                                else if (typeof req[validationObject.type][validationObject.name] === 'string') {

                                    //Check if it is a boolean in string format
                                    if (req[validationObject.type][validationObject.name].toLowerCase() == 'true' ||
                                        req[validationObject.type][validationObject.name].toLowerCase() == 'false') {

                                        //Ensure boolean string is in lowercase format
                                        req[validationObject.type][validationObject.name] = req[validationObject.type][validationObject.name].toLowerCase();

                                        //Use an equality operator to convert into a proper boolean value
                                        req[validationObject.type][validationObject.name] = (req[validationObject.type][validationObject.name] === 'true');
                                    }

                                    //Else the string is not a boolean
                                    else {

                                        //Then throw an error
                                        return {
                                            errorType: 'data-type',
                                            errorName: validationObject.name,
                                            errorDataType: validationObject.dataType
                                        };
                                    }
                                }

                                //Else if it's not a boolean but actually a number
                                else if (typeof req[validationObject.type][validationObject.name] === 'number') {

                                    //If it's a boolean in number format (aka a binary 1 or 0)
                                    if (req[validationObject.type][validationObject.name] == 0 ||
                                        req[validationObject.type][validationObject.name] == 1) {

                                        //Then use an equality operator to convert it into a boolean
                                        req[validationObject.type][validationObject.name] = (req[validationObject.type][validationObject.name] === 1);
                                    }

<<<<<<< Updated upstream
                                    //Else since the number provided is not a boolean
=======
                                    //Else the number is not a boolean
>>>>>>> Stashed changes
                                    else {

                                        //Then throw an error
                                        return {
                                            errorType: 'data-type',
                                            errorName: validationObject.name,
                                            errorDataType: validationObject.dataType
                                        };
                                    }
                                }
                            } else if (validationObject.dataType === 'string') {

                                if (typeof req[validationObject.type][validationObject.name] !== 'string') {

                                    //Then throw an error
                                    return {
                                        errorType: 'data-type',
                                        errorName: validationObject.name,
                                        errorDataType: validationObject.dataType
                                    };
                                }

                            } else if (validationObject.dataType === 'json') {

                                //IF typeof is not a string and not an object
                                //Then it's not json
                                //(json will be a string if stringified beforehand)
                                if (typeof req[validationObject.type][validationObject.name] !== 'string' &&
                                    typeof req[validationObject.type][validationObject.name] !== 'object') {

                                    //Then throw an error
                                    return {
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
                                //But verify make sure it is valid JSON
                                else {
                                    try {
                                        JSON.parse(req[validationObject.type][validationObject.name]);
                                    } catch (err) {
                                        return {
                                            errorType: 'invalid-json',
                                            errorName: validationObject.name,
                                            errorDataType: validationObject.dataType
                                        };
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
<<<<<<< Updated upstream

                                    //Then throw an error
                                    return {
                                        errorType: 'out-of-range',
                                        errorRange: req[validationObject.type][validationObject.name],
                                        errorLimit: JSON.stringify(validationObject.range)
                                    };
                                }
                            }

                            //If it's a protected resource AND the user is not an admin
                            //AND the data type is not id (protection of database rows is handled in the id section)
                            //Then force the query/param/body property to the default
                            if (validationObject.protected !== undefined &&
                                validationObject.protected &&
                                req.headers.user.role !== 'admin' &&
                                validationObject.dataType !== 'id') {

                                //If a default is not defined
                                if (validationObject.default === undefined) {

                                    //Then throw an internal server error and log the error
                                    //Because the validationSchema is missing a default
                                    console.log(`${validationObject.name} is a protected non-id, but no default was assigned in the validationSchema ${req.method} - ${req.originalUrl}`);
                                    return {
                                        errorType: 'default'
                                    };
                                } else {

                                    //Reset the protected resource to default
                                    req[validationObject.type][validationObject.name] = validationObject.default;
                                }
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

=======

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

>>>>>>> Stashed changes
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
                }

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
                                message: `${err.errorName} must be a ${err.errorDataType}`
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