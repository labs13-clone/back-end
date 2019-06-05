
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {sub_id: 'auth0sub1'},
        {sub_id: 'auth0sub2'},
        {sub_id: 'auth0sub3'},
        {sub_id: 'auth0sub4'},
        {sub_id: 'auth0sub5'},
        {sub_id: 'auth0sub6'}
      ]);
    });
};