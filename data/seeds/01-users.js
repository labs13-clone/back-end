
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {sub_id: 'auth0|5cf49ed6da99ee0dfc321b9d', nickname: 'User1', picture: 'https://pixel.nymag.com/imgs/daily/following/2015/11/02/02-troll-face.w700.h700.jpg'},  // admin
        {sub_id: 'auth0|5cf19cace119a00e85767e47', nickname: 'User2', picture: 'https://pixel.nymag.com/imgs/daily/following/2015/11/02/02-troll-face.w700.h700.jpg'}, // admin
        {sub_id: 'auth0|5cf837592aa2430bf7bcd56d', nickname: 'User3', picture: 'https://pixel.nymag.com/imgs/daily/following/2015/11/02/02-troll-face.w700.h700.jpg'}, // user
        {sub_id: 'auth0|5cf8398443ab360dc0d3a650', nickname: 'User4', picture: 'https://pixel.nymag.com/imgs/daily/following/2015/11/02/02-troll-face.w700.h700.jpg'}, // user
        {sub_id: 'auth0|5cf168e00658590f42c59867', nickname: 'User5', picture: 'https://pixel.nymag.com/imgs/daily/following/2015/11/02/02-troll-face.w700.h700.jpg'}, // user
        {sub_id: 'auth0|5cf410ace4c4be0e9d7cd843', nickname: 'User6', picture: 'https://pixel.nymag.com/imgs/daily/following/2015/11/02/02-troll-face.w700.h700.jpg'}, // user
      ]);
    });
};