const db = require('../data/dbConfig');

module.exports = {
    insert,
    getAll,
    getBySubId
}

//Add a user to the database
function insert(user) {
    return db('users').insert(user).returning('id').then(idArr => {
        const id = idArr[0];
        console.log(id)
        return db('users').where({
            id
        }).first();
    });
}

function getAll() {
    return db('users');
}

function getBySubId(sub_id) {
    console.log(sub_id)
    return db('users').where({
        sub_id
    }).first();
}