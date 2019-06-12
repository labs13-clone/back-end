const db = require('../../data/dbConfig');

module.exports = {
    insert,
    update,
    getOne,
    getMany,
}

//Add a challenge to the database
//Returns the updated challenge object
function insert(challenge) {
    challenge.tests = JSON.stringify(challenge.tests)
    return db('challenges')
        .insert(challenge)
        .returning('id')
        .then(idArr => {
            const id = idArr[0];
            return db('challenges')
                .where({
                    id
                }).first();
        });
}

//Update a challenge
//Returns the updated challenge object
function update(selector = null, payload) {
    if(payload.tests !== undefined) payload.tests = JSON.stringify(payload.tests)
    if (!selector) return new Error('No selector provided for the update');
    return db('challenges')
        .where(selector)
        .update(payload)
        .returning('id')
        .then(idArr => {
            const id = idArr[0];
            return db('challenges')
                .where({
                    id
                }).first();
        });
}

//Get multiple challenges in the database
//Filterable by sending in an object literal that matches the challenges schema
function getMany(filter = {}) {
    return db('challenges')
        .where(filter);
}

//Get a single challenge object
//Filterable by sending in an object literal that matches the challenges schema
function getOne(filter = null) {
    if (!filter) return new Error('No filter provided for the query');
    return db('challenges')
        .where(filter)
        .first();
}