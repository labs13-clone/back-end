exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('challenges_categories').del()
    .then(function () {
      // Inserts seed entries
      return knex('challenges_categories').insert([
        {
          challenge_id:1,
          categories_id:1
        }
      ]);
    });
};
