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

            //Use the new id to return a standard challenge object
            return parseFilter({
                    id: idArr[0]
                })
                //Only return the challenge object inserted
                .first()
                .then(async challenge => {

                    //Retrieve category info in an array
                    const challengeCategories = await db.select(
                            'categories.id',
                            'categories.name'
                        )
                        .from('categories')
                        .leftJoin('challenges_categories', 'categories.id', 'challenges_categories.category_id')
                        .where({
                            'challenges_categories.challenge_id': challenge.id
                        });

                    //Add categories property on response
                    return {
                        ...challenge,
                        categories: challengeCategories,
                        popularity: parseInt(challenge.popularity, 10)
                    }
                });
        });
}

//Update a challenge
//Returns the updated challenge object
function update(selector = null, payload) {

    //Parse tests and throw error if no challenge was selected
    if (payload.tests !== undefined) payload.tests = JSON.stringify(payload.tests);
    if (!selector) return new Error('No selector provided for the update');

    //Update the challenge object
    return db('challenges')
        .where(selector)
        .update(payload)
        .returning('id')
        .then(idArr => {

            //Use the new id to return a standard challenge object
            return parseFilter({
                    id: idArr[0]
                })
                //Only return the challenge object that was updated
                .first()
                .then(async challenge => {
                    //Retrieve category info in an array
                    const challengeCategories = await db.select(
                            'categories.id',
                            'categories.name'
                        )
                        .from('categories')
                        .leftJoin('challenges_categories', 'categories.id', 'challenges_categories.category_id')
                        .where({
                            'challenges_categories.challenge_id': challenge.id
                        });

                    //Add categories property on response
                    return {
                        ...challenge,
                        categories: challengeCategories,
                        popularity: parseInt(challenge.popularity, 10)
                    }
                });
        });
}

//Get multiple challenges in the database
//Filterable by sending in an object literal that matches the challenges schema
function getMany(filter = {}) {

    //Parse filter and edit the query
    const queryBuilder = parseFilter(filter);

    //Finish building the query
    return queryBuilder
        //Then insert the challenges applicable categories in a nested array
        .then(challenges => {

            //Map over each challenge
            const parsed = challenges.map(async challenge => {

                //Retrieve category info in an array
                const challengeCategories = await db.select(
                        'categories.id',
                        'categories.name'
                    )
                    .from('categories')
                    .leftJoin('challenges_categories', 'categories.id', 'challenges_categories.category_id')
                    .where({
                        'challenges_categories.challenge_id': challenge.id
                    });

                //Add categories property on response
                return {
                    ...challenge,
                    categories: challengeCategories,
                    popularity: parseInt(challenge.popularity, 10)
                }
            });

            return Promise.all(parsed);
        })
        .catch(err => console.log(err));

}

//Get a single challenge object
//Filterable by sending in an object literal that matches the challenges schema
function getOne(filter = null) {

    if (!filter) return new Error('No filter provided for the query');

    //Parse filter and edit query
    const queryBuilder = parseFilter(filter);

    return queryBuilder
        .where(filter)
        //getOne only returns one challenge object
        .first()
        .then(async challenge => {

            //Sometimes IDs that do not exist are looked up by the middleware
            //If the ID does not exist then the following code within the if block will cause an error.
            if (challenge !== undefined) {

                //Retrieve category info in an array
                const challengeCategories = await db.select(
                        'categories.id',
                        'categories.name'
                    )
                    .from('categories')
                    .leftJoin('challenges_categories', 'categories.id', 'challenges_categories.category_id')
                    .where({
                        'challenges_categories.challenge_id': challenge.id
                    });

                //Add categories property on response
                return {
                    ...challenge,
                    categories: challengeCategories,
                    popularity: parseInt(challenge.popularity, 10)
                }
            }

        });
}

//Filters can be on different tables...
//Filters can also necessitate different knex query builder functions
//Here we start with an initial query
//And dynamically build on top of it.
function parseFilter(filter) {

    const queryBuilder = db
        .select(
            'challenges.id',
            'challenges.created_by',
            'challenges.approved',
            'challenges.title',
            'challenges.description',
            'challenges.tests',
            'challenges.skeleton_function',
            'challenges.solution',
            'challenges.difficulty'
        )
        .count('user_submissions.id as popularity')
        .from('challenges')
        .leftJoin('challenges_categories', 'challenges.id', 'challenges_categories.challenge_id')
        .leftJoin('categories', 'challenges_categories.category_id', 'categories.id')
        .leftJoin('user_submissions', 'challenges.id', 'user_submissions.challenge_id')
        .groupBy('challenges.id')

    //.where() Filter Builders
    //Possible .where() filters and their applicable tables
    const challenges = ['created_by', 'approved', 'id', 'difficulty', 'title'];
    const categories = ['category_id', 'category_name'];
    const user_submissions = ['completed_by', 'started_by'];

    //Parse Challenge Table Filters
    challenges.forEach(key => {

        //If the parameter exists on the filter object
        if (filter[key] !== undefined) {

            //difficulty query param does not use .where()
            //If there's a difficulty range query parameter in the request
            //Then we need to alter the query and filter
            if (key === 'difficulty') {

                //Add difficulty filter to the query builder using whereBetween()
                queryBuilder.whereBetween('difficulty', filter[key]);
            }

            //Unlike most other query filters, title uses a different knex query
            else if (key == 'title') {

                //title uses a partial string match query
                //queryBuilder.where('challenges.title', 'like', filter[key])
                queryBuilder.whereRaw("LOWER(challenges.title) LIKE '%' || LOWER(?) || '%' ", filter[key])
            }

            //Else for all other query parameters in the challenges table
            else {

                //Assign table
                filter[`challenges.${key}`] = filter[key];
            }

            //Delete invalid property that doesn't have the table
            deleteKey(key);
        }
    });

    //Parse Challenge Table Filters
    categories.forEach(key => {

        //If the parameter exists on the filter object
        if (filter[key] !== undefined) {

            //Rename category_id to id
            if (key === 'category_id') {
                filter[`categories.id`] = filter[key];
            }

            //category_name uses a different knex query
            else if (key == 'category_name') {

                //Unlike all other query filters
                //category_name uses a partial string match query
                //queryBuilder.where('categories.name', 'like', filter[key])
                queryBuilder.whereRaw("LOWER(categories.name) LIKE '%' || LOWER(?) || '%' ", filter[key])
            }

            //Delete invalid property that doesn't have the table
            deleteKey(key);
        }
    });

    //Parse Challenge Table Filters
    user_submissions.forEach(key => {

        //If the parameter exists on the filter object
        if (filter[key] !== undefined) {

            //If completed_by
            if (key === 'completed_by') {

                //Then add a where filter for user_submissions.completed === true
                //Completed challenges will always have an existing user_submissions row
                filter[`user_submissions.completed`] = true;
                filter[`user_submissions.created_by`] = filter.completed_by;

            }

            //If started_by
            else if (key === 'started_by') {

                //Then add a where filter for user_submissions.completed = false
                //But it exists, so they have started on the challenge
                filter[`user_submissions.created_by`] = filter.started_by;
                filter[`user_submissions.completed`] = false;

            }

            //Delete the invalid filter property
            deleteKey(key);
        }
    });

    //Apply pagination and sorting parameters
    // const limit = filter.limit;
    // const offset = (filter.page - 1) * limit;
    // const orderBy = filter.order_by;
    // queryBuilder.orderBy(orderBy, 'desc').orderBy('id', 'asc').limit(limit).offset(offset);

    // delete filter.page;
    // delete filter.limit;
    // delete filter.order_by;

    //Utility function to delete old filter properties after they are parsed
    //The old properties will cause an invalid column error because the table is not specified
    //We are using a joined query below so table name needs to be included with properties
    //And some filter parameters are translated from semantic names to actual column names 
    function deleteKey(key) {
        delete filter[key];
    }

    //Apply the parsed filter to the query builder
    queryBuilder.where(filter);

    return queryBuilder;
}