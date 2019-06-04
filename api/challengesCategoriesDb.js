const db = require('../data/dbConfig');

module.exports = {
    insert,
    remove,
    getMany,
}

//Add a challenge category to the database
//Returns the new challenge category object
function insert(challengeCategory) {
    return db('challenges_categories').insert(challengeCategory).returning('id').then(idArr => {
        const id = idArr[0];
        return db('challenges_categories').where({
            id
        }).first();
    });
}

//Delete a challenge category
//Returns the deleted id
function remove(selector = null) {
    if (!selector) return new Error('No selector provided for deletion');
    return db('challenges_categories').where(selector).delete().returning('id');
}

//Get multiple challenges_categories in the database
//Filterable by sending in an object literal that matches the challenges_categories schema
function getMany(filter = {}) {
    return db('challenges_categories').where(filter);
}