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
    if (payload.tests !== undefined) payload.tests = JSON.stringify(payload.tests);
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

    //Filters can be on two different tables.. challenges and categories
    //Assign the proper table to each filter used in .where()
    Object.keys(filter).forEach(key => {

        //Possible filters and their applicable tables
        const challenges = ['difficulty', 'created_by', 'approved', 'id'];
        const categories = ['category_id', 'category_name'];

        //If the filter is in the challenges table
        if (challenges.includes(key)) {

            //Add table to key
            filter[`challenges.${key}`] = filter[key];
        }

        //Else If the filter is in the categories table
        else if (categories.includes(key)) {

            //Rename category_id to id
            if (key === 'category_id') {
                filter[`categories.id`] = filter[key];
            }

            //Rename category_name to name
            else if (key == 'category_name') {
                filter[`categories.name`] = filter[key];
            }

            //Else add table to key
            else {
                filter[`categories.${key}`] = filter[key];
            }
        }

        //Delete the old property
        //It will cause an invalid column error
        //Because the tables is not specified
        //And we are using a joined query below
        delete filter[key];
    });

    //If there's a difficulty range query parameter in the request
    //Then we need to alter the query and filter
    if (filter['challenges.difficulty'] !== undefined) {

        //It will be represented as a string IE. "1-33" || "33-66" || "66-100"
        var difficulty = filter['challenges.difficulty'];

        //Convert it into an array with numbers
        //That way it works with the knex query builder where function IE. .whereIn('difficulty'. [1-33])
        difficulty = difficulty.split('-').map(str => Number(str));

        //Remove difficulty from the filter object used in .where()
        delete filter['challenges.difficulty'];

        return db
            .select(
                'challenges.id',
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
            .where(filter)
            .whereBetween('difficulty', difficulty)
            .groupBy('challenges.id')
            .orderBy('challenges.id')
            .then(challenges => {

                const parsed = challenges.map(async challenge => {

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
                });

                return Promise.all(parsed);
            });

    }

    //Else there's no difficulty
    //So we don't need to alter the query or filter
    else {
        return db.select(
                'challenges.id',
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
            .where(filter)
            .groupBy('challenges.id')
            .orderBy('challenges.id')
            .then(challenges => {

                const parsed = challenges.map(async challenge => {

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
                });

                return Promise.all(parsed);
            });
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