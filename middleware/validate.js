const categories = require('../apis/db/categories');
const challenges_categories = require('../apis/db/challengesCategories');
const challenges = require('../apis/db/challenges');
const user_submissions = require('../apis/db/userSubmissions');
const users = require('../apis/db/users');

/*

    BELOW FUNCTIONS ARE EXPORTED FOR USE IN VALIDATION

*/

function convertBoolean(target) {

    //Use an equality operator to convert into a proper boolean value
    if (isString(target)) {

        return (target.toLowerCase() === 'true' || target === '1');

    } else {

        return (target === 1);
    }
}

function convertRange(target) {

    //Split by - delimiter
    //Convert each array item to a number
    //Will return an array with two numbers
    return target.split('-').map(numString => {
        return parseInt(numString, 10);
    });
}

function isArray(target) {
    return Array.isArray(target);
}

function isBoolean(target) {
    if (typeof target === 'boolean') {
        return true;
    } else if (isString(target) &&
        (target.toLowerCase() === 'true' ||
            target.toLowerCase() === 'false' ||
            target === '0' ||
            target === '1')) {
        return true;
    } else if (isInteger(target) && (target === 0 || target === 1)) {
        return true;
    } else {
        return false;
    }
}

function isInteger(target) {
    try {
        //Convert before checking in case it's a String via a query param
        target = parseInt(target, 10);
    }
    //If an error occurs it's not a number
    catch (err) {
        return false;
    }
    return Number.isInteger(target);
}

function isJson(target) {
    //If it's not a string then it's not JSON
    if (!isString(target)) {
        return false;
    } else {
        try {
            //Attempt to parse the target
            JSON.parse(target);
        } catch (err) {
            return false;
        }
        //If JSON.parse doesn't throw an error
        return true;
    }
}

function isObject(target) {
    return target === Object(target);
}

function isString(target) {
    return Object.prototype.toString.call(target) === "[object String]";
}

function isRange(target) {

    //If it's in string form
    if (isString(target)) {

        //Make sure the delimiter is present
        if (!target.includes('-')) {
            return false;
        } else {

            //Split reduce while attempting to convert the string delimited by - to a number
            //Will return false if 
            return target.split('-').reduce((prev, curr) => {
                return isNaN(Number(curr)) || !prev ? false : true;
            }, true);
        }
    } else if (isArray(target)) {
        //Else if it's in array form

        //Ranges can only have 2 items
        if (target.length !== 2) {
            return false;
        } else {

            //Test both values are integers
            let valid = true;
            target.forEach(item => {
                if (!isInteger(item)) {
                    valid = false;
                }
            });
            return valid;
        }
    } else {
        
        //If it's not a string or a number then it's not a range
        return false;
    }
}

function existsWhere(table, filter) {
    const api = dbTableSwitch(table);
    return api.getOne(filter)
        .then(res => {
            return res !== undefined;
        });
}

module.exports = {
    convertBoolean,
    convertRange,
    existsWhere,
    isArray,
    isBoolean,
    isInteger,
    isJson,
    isObject,
    isRange,
    isString,
}

/*

    HELPER FUNCTIONS ARE NOT EXPORTED AND ARE ONLY USED IN THIS MODULE

*/

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