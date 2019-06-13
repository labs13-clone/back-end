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
    challenge.tests = JSON.stringify(challenge.tests);
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
    if(payload.tests !== undefined) payload.tests = JSON.stringify(payload.tests);
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

        //If there's a difficulty range query parameter in the request
        //Then we need to alter the query and filter
        if (filter.difficulty !== undefined) {

            //It will be represented as a string IE. "1-33" || "33-66" || "66-100"
            var difficulty = filter.difficulty;

            //Convert it into an array with numbers
            //That way it works with the knex query builder where function IE. .whereIn('difficulty'. [1-33])
            difficulty = difficulty.split('-').map(str => Number(str));

            //Remove difficulty from the filter object used in .where()
            delete filter.difficulty;

            return db('challenges')
                .where(filter)
                .whereBetween('difficulty', difficulty)
                .join('challenges_categories as categories', 'challenges.id', 'categories.challenge_id');
        }

        //Else there's no difficulty
        //So we don't need to alter the query or filter
        else {
            return db('challenges')
                .where(filter)
                .join('challenges_categories as categories', 'challenges.id', 'categories.challenge_id');
        }

}

//Get a single challenge object
//Filterable by sending in an object literal that matches the challenges schema
function getOne(filter = null) {
    if (!filter) return new Error('No filter provided for the query');
    return db('challenges')
        .where(filter)
        .first();
}