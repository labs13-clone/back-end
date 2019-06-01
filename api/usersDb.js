const db = require('../data/dbConfig');

module.exports = {
    add,
    getAll,
    getBySubId
}

function add(user) {
    return db('users').insert(user).returning('id');
}

function getAll() {
    return db('users');
}

function getBySubId(sub_id) {
    return db('users').where({
        sub_id
    }).first();
}