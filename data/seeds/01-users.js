
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {sub: 'auth0sub1', role: 'admin'},
        {sub: 'auth0sub2', role: 'user'},
        {sub: 'auth0sub3', role: 'user'}
      ]);
    });
};