const db = require('../data/dbConfig');

module.exports = {
    add,
    get
}

function add(user) {
    return db('users').insert(user).returning('id');
}

function get() {
    return db('users');
}