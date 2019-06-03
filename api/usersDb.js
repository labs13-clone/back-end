const db = require('../data/dbConfig');

module.exports = {
    insert,
    getMany,
    getOne
}

//Add a user to the database
function insert(user) {
    return db('users').insert(user).returning('id').then(idArr => {
        const id = idArr[0];
        return db('users').where({
            id
        }).first();
    });
}

//Get multiple users in the database
//Filterable by sending in an object literal that matches the user schema
function getMany(filter = {}) {
    return db('users').where(filter);
}

//Get a single user object from their Auth0 sub id
//Filterable by sending in an object literal that matches the user schema
function getOne(filter = null) {
    if (!filter) return new Error('No filter provided for the query');
    return db('users').where(filter).first();
}