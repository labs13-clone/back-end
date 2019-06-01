
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {sub_id: 'auth0sub1', role: 'admin'},
        {sub_id: 'auth0sub2', role: 'user'},
        {sub_id: 'auth0sub3', role: 'user'}
      ]);
    });
};