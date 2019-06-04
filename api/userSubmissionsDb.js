const db = require('../data/dbConfig');

module.exports = {
    insert,
    update,
    getOne,
    getMany
}

//Add a user submission to the database
function insert(userSubmission) {
    return db('user_submissions').insert(userSubmission).returning('id').then(idArr => {
        const id = idArr[0];
        return db('user_submissions').where({
            id
        }).first();
    });
}

//Update a user submission
//Returns the updated submission object
function update(selector = null, payload) {
    if (!selector) return new Error('No selector provided for the update');
    return db('user_submissions').where(selector).update(payload).returning('id').then(idArr => {
        const id = idArr[0];
        return db('user_submissions').where({
            id
        }).first();
    });
}

//Get multiple challenge submissions in the database
//Filterable by sending in an object literal that matches the user_submissions schema
function getMany(filter = {}) {
    return db('user_submissions').where(filter);
}

//Get a single challenge submission object
//Filterable by sending in an object literal that matches the user_submissions schema
function getOne(filter = null) {
    if (!filter) return new Error('No filter provided for the query');
    return db('user_submissions').where(filter).first();
}