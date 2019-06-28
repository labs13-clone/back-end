const db = require('../../data/dbConfig');

module.exports = {
    insert,
    update,
    remove,
    getOne,
    getMany,
}

//Add a category to the database
//Returns the new category object
function insert(category) {
    return db('categories')
        .insert(category)
        .returning('id')
        .then(idArr => {
            const id = idArr[0];
            return db('categories')
                .where({
                    id
                }).first();
        });
}

//Update a category
//Returns the updated category object
function update(selector = null, payload) {
    if (!selector) return new Error('No selector provided for the update');
    return db('categories')
        .where(selector)
        .update(payload)
        .returning('id')
        .then(idArr => {
            const id = idArr[0];
            return db('categories')
                .where({
                    id
                })
                .first();
        });
}

//Delete a category
//Returns the deleted id
function remove(selector = null) {
    if (!selector) return new Error('No selector provided for deletion');
    return db('categories')
        .where(selector)
        .delete()
        .returning('id');
}

//Get multiple categories in the database
//Filterable by sending in an object literal that matches the categories schema
function getMany(filter = {}) {

    //If the query param `challenges` is passed in
    //Then only return categories which have been attached to challenges
    if (filter.challenges !== undefined) {

        //Remove the challenges property from the filter
        //It will make the .where(filter) invalid
        delete filter.challenges;

        //Get unique category_ids from the many to many table
        return db('challenges_categories')
            .distinct()
            .pluck('category_id')
            .then(ids => {

                //Use the list of category IDs to only get categories that are attached to challenges
                return db('categories').whereIn('id', ids).where(filter).orderBy('name', 'asc');
            });
        
    } else {
        
        //Else return a standard categories query
        return db('categories').where(filter).orderBy('name', 'asc');
    }

}

//Get a single challenge object
//Filterable by sending in an object literal that matches the categories schema
function getOne(filter = null) {
    if (!filter) return new Error('No filter provided for the query');
    return db('categories')
        .where(filter)
        .first();
}