const db = require('../../data/dbConfig');
const categoriesApi = require('../db/categories');

module.exports = {
    insert,
    getMany,
    getOne
}

//Add a user to the database
function insert(user) {
    return db('users')
        .insert(user)
        .returning('id')
        .then(idArr => {
            const id = idArr[0];
            return db('users')
                .where({
                    id
                }).first();
        });
}

//Get multiple users in the database
//Filterable by sending in an object literal that matches the user schema
function getMany(filter = {}) {
    return db('users')
        .where(filter)
        .then(users => {
            const allUsers = users.map(async user => {

                const xp = await db('user_submissions')
                    .sum('challenges.difficulty as xp')
                    .leftJoin('challenges', 'user_submissions.challenge_id', 'challenges.id')
                    .where({
                        'user_submissions.completed': 1,
                        'user_submissions.created_by': user.id
                    })
                    .first();

                return {
                    ...user,
                    xp: Number(xp.xp)
                }

            })
            return Promise.all(allUsers);
        });

}
//Get a single user object from their Auth0 sub id
//Filterable by sending in an object literal that matches the user schema
function getOne(filter = null) {
    if (!filter) return new Error('No filter provided for the query');
    return db('users')
        .where(filter)
        .first()
        .then(async user => {

            if (user !== undefined) {

                //Get all unique categories that are tied to a challenge
                const applicableCategories = await categoriesApi.getMany({
                    challenges: true
                });

                //Get the user's total earned experience 
                const totalXp = await db('user_submissions')
                    .sum('challenges.difficulty as xp')
                    .leftJoin('challenges', 'user_submissions.challenge_id', 'challenges.id')
                    .leftJoin('challenges_categories', 'user_submissions.challenge_id', 'challenges_categories.challenge_id')
                    .leftJoin('categories', 'challenges_categories.category_id', 'categories.id')
                    .where({
                        'user_submissions.completed': 1,
                        'user_submissions.created_by': user.id
                    })
                    .first();

                //Get total users
                const numUsers= db('users')
                    .count('id as users')
                    .first();

                //For each category
                const categorySpecific = applicableCategories.map(cat => {

                    //Get the user's total experience earned per category
                    const userSpecific = db('user_submissions')
                        .sum('challenges.difficulty as user_xp_earned')
                        .count('user_submissions.created_by as user_challenges_complete')
                        .leftJoin('challenges', 'user_submissions.challenge_id', 'challenges.id')
                        .leftJoin('challenges_categories', 'user_submissions.challenge_id', 'challenges_categories.challenge_id')
                        .leftJoin('categories', 'challenges_categories.category_id', 'categories.id')
                        .where({
                            'user_submissions.completed': 1,
                            'user_submissions.created_by': user.id,
                            'challenges_categories.category_id': cat.id
                        })
                        .first();

                    //Get the total possible experience
                    const categorySpecific = db('challenges')
                        .sum('difficulty as total_possible_xp')
                        .count('id as total_possible_challenges')
                        .leftJoin('challenges_categories', 'challenges.id', 'challenges_categories.challenge_id')
                        .where({
                            'challenges_categories.category_id': cat.id
                        })
                        .first();

                    //Get total challenges completed per category for all users
                    //Get total experience earned per category for all users
                    const allUserSubmissions = db('user_submissions')
                        .sum('challenges.difficulty as all_users_xp_earned')
                        .count('user_submissions.created_by as all_users_challenges_complete')
                        .leftJoin('challenges', 'user_submissions.challenge_id', 'challenges.id')
                        .leftJoin('challenges_categories', 'user_submissions.challenge_id', 'challenges_categories.challenge_id')
                        .leftJoin('categories', 'challenges_categories.category_id', 'categories.id')
                        .where({
                            'user_submissions.completed': 1,
                            'challenges_categories.category_id': cat.id
                        })
                        .first();

                    return Promise.all([cat, userSpecific, categorySpecific, allUserSubmissions]);
                });

                return Promise.all([totalXp, numUsers, categorySpecific])
                    .then(result => {

                        const [totalXp, numUsers, categorySpecific] = result;

                        return Promise.all(categorySpecific)
                            .then(category => {

                                return category.map(cat => {

                                    const [{
                                        id,
                                        name
                                    }, userSpecific, categorySpecific, allUserSubmissions] = cat;

                                    return {
                                        id,
                                        name,
                                        userXpEarned: Number(userSpecific.user_xp_earned),
                                        userChallengesCompleted: Number(userSpecific.user_challenges_complete),
                                        totalPossibleXp: Number(categorySpecific.total_possible_xp),
                                        totalPossibleChallenges: Number(categorySpecific.total_possible_challenges),
                                        totalXpEarned: Number(allUserSubmissions.all_users_xp_earned),
                                        totalChallengesCompleted: Number(allUserSubmissions.all_users_challenges_complete)
                                    }
                                });
                            })
                            .then(categories => {
                                return {
                                    ...user,
                                    xp: Number(totalXp.xp),
                                    numUsers: Number(numUsers.users),
                                    categories
                                }
                            });
                    });

            } else {
                return user;
            }
        });
}