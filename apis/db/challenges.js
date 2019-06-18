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
        }).catch(err => console.log(err));
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

                console.log(challenge.created_by)

                //Retrieve category info in an array
                const challengeCategories = await db.select(
                        'categories.id',
                        'categories.name'
                    )
                    .from('categories')
                    .leftJoin('challenges_categories', 'categories.id', 'challenges_categories.categories_id')
                    .where({
                        'challenges_categories.challenge_id': challenge.id
                    });

                //Add categories property on response
                return {
                    ...challenge,
                    categories: challengeCategories
                }
            });

            return Promise.all(parsed);
        });

}

//Get a single challenge object
//Filterable by sending in an object literal that matches the challenges schema
function getOne(filter = null) {

    if (!filter) return new Error('No filter provided for the query');

    //Parse filter and edit query
    const queryBuilder = parseFilter(filter);

    //getOne(), so only return one object
    queryBuilder.first();

    return queryBuilder
        .where(filter)
        .then(async challenge => {

            //Sometimes IDs that do not exist are looked up by the middleware
            //If the ID does not exist then the following code will cause an error.
            if(challenge !== undefined) {

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
        .from('challenges')
        .leftJoin('challenges_categories', 'challenges.id', 'challenges_categories.challenge_id')
        .leftJoin('categories', 'challenges_categories.categories_id', 'categories.id')
        .leftJoin('user_submissions', 'challenges.id', 'user_submissions.challenge_id')
        .groupBy('challenges.id')
        .orderBy('challenges.id');

    //.where() Filter Builders
    //Possible .where() filters and their applicable tables
    const challenges = ['created_by', 'approved', 'id', 'difficulty'];
    const categories = ['category_id', 'category_name'];
    const user_submissions = ['completed', 'started'];

    //Parse Challenge Table Filters
    challenges.forEach(key => {

        //If the parameter exists on the filter object
        if (filter[key] !== undefined) {

            //difficulty query param does not use .where()
            //If there's a difficulty range query parameter in the request
            //Then we need to alter the query and filter
            if (key === 'difficulty') {

                //It will be represented as a string IE. "1-33" || "33-66" || "66-100"
                var difficulty = filter.difficulty;

                //Convert it into an array with numbers
                //That way it works with the knex query builder where function IE. .whereIn('difficulty'. [1-33])
                difficulty = difficulty.split('-').map(str => Number(str));

                //Remove difficulty from the filter object used in .where()
                delete filter.difficulty;

                //Add difficulty filter to the query builder
                queryBuilder.whereBetween('difficulty', difficulty);

            }

            //Else for all other query parameters in the challenges table
            else {
                //Assign table
                filter[`challenges.${key}`] = filter[key];

                //Delete invalid property that doesn't have the table
                deleteKey(key);
            }
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
            //Rename category_name to name
            else if (key == 'category_name') {
                filter[`categories.name`] = filter[key];
            }
            //Delete invalid property that doesn't have the table
            deleteKey(key);
        }
    });

    //Parse Challenge Table Filters
    user_submissions.forEach(key => {

        //If the parameter exists on the filter object
        if (filter[key] !== undefined) {

            //If completed and completed boolean is true
            if (key === 'completed' && (filter[key] == 'true' || filter[key] == true)) {

                //Then add a where filter for user_submissions.completed
                //Completed challenges will always have an existing user_submissions
                filter[`user_submissions.completed`] = filter[key];
                filter[`user_submissions.created_by`] = filter.completed_by;

                //Delete invalid property that doesn't have the table
                deleteKey(key);
                deleteKey('completed_by');
            } else if (key === 'completed') {
                //Delete invalid property that doesn't have the table
                deleteKey(key);
                deleteKey('completed_by');
            }

            //If started and completed boolean is true
            else if (key === 'started' && (filter[key] == 'true' || filter[key] == true)) {

                //Then add a where filter for user_submissions.completed = false
                //But it exists, so they have started on the challenge
                filter[`user_submissions.created_by`] = filter.started_by;
                filter[`user_submissions.completed`] = false;

                //Delete invalid property that doesn't have the table
                deleteKey(key);
                deleteKey('started_by');

            } else if (key === 'started') {
                //Delete invalid property that doesn't have the table
                deleteKey(key);
                deleteKey('started_by');
            }
        }
    });

    //Delete the old property
    //It will cause an invalid column error
    //Because the table is not specified
    //And we are using a joined query below
    function deleteKey(key) {
        delete filter[key];
    }

    console.log(filter)

    //Apply the parsed filter to the query builder
    queryBuilder.where(filter)

    return queryBuilder;
}