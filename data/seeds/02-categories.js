
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('categories').del()
    .then(function () {
      // Inserts seed entries
      return knex('categories').insert([
        {name: 'category1'},
        {name: 'category2'},
        {name: 'category3'},
        {name: 'category4'},
        {name: 'category5'},
        {name: 'category6'}
      ]);
    });
};
