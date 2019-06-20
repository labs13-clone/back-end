
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {sub_id: 'auth0|5cf49ed6da99ee0dfc321b9d', nickname: 'jane', picture: 'https://s.gravatar.com/avatar/b26407fdbb151a3a44fceda692c92874?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fja.png'},  // admin
        {sub_id: 'auth0|5cf19cace119a00e85767e47', nickname: 'william', picture: 'https://s.gravatar.com/avatar/2dc057feeb6e65da009d01466320d609?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fwi.png'}, // admin
        {sub_id: 'auth0|5cf837592aa2430bf7bcd56d', nickname: 'lambda', picture: 'https://s.gravatar.com/avatar/d1b8f2d9d0346bf39c5af86c41c3c7f6?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fla.png'}, // user
        {sub_id: 'auth0|5cf8398443ab360dc0d3a650', nickname: 'chase', picture: 'https://s.gravatar.com/avatar/86bdb416468a9fff4affb0ddcc5277ed?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fch.png'}, // user
        {sub_id: 'auth0|5cf168e00658590f42c59867', nickname: 'dan', picture: 'https://s.gravatar.com/avatar/1740f1652d3096705ef08a0a3c0fe78f?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fda.png'}, // user
        {sub_id: 'auth0|5cf410ace4c4be0e9d7cd843', nickname: 'test', picture: 'https://s.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png'}, // user
      ]);
    });
};