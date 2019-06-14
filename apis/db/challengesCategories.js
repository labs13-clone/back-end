const db = require('../../data/dbConfig');

module.exports = {
    insert,
    remove,
    getMany,
}

//Add a challenge category to the database
//Returns the new challenge category object
function insert(challengeCategory) {
    return db('challenges_categories').insert(challengeCategory).returning('challenge_id').then(idArr => {
        const id = idArr[0];
        return db.select(
                'challenges.id',
                'challenges.approved',
                'challenges.title',
                'challenges.description',
                'challenges.tests',
                'challenges.skeleton_function',
                'challenges.solution',
                'challenges.difficulty'
            )
            .from('challenges')
            .leftJoin('challenges_categories', 'challenges.id', 'challenges_categories.challenge_id')
            .leftJoin('categories', 'challenges_categories.categories_id', 'categories.id')
            .where({
                ['challenges.id']: id
            })
            .groupBy('challenges.id')
            .orderBy('challenges.id')
            .first()
            .then(async challenge => {

                const challengeCategories = await db.select(
                        'categories.id',
                        'categories.name'
                    )
                    .from('categories')
                    .leftJoin('challenges_categories', 'categories.id', 'challenges_categories.categories_id')
                    .where({
                        'challenges_categories.challenge_id': challenge.id
                    });

                return {
                    ...challenge,
                    categories: challengeCategories
                }
            })
            .catch(err => console.log(err))
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