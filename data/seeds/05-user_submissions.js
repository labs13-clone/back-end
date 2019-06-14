exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('user_submissions').del()
      .then(function () {
        // Inserts seed entries
        return knex('user_submissions').insert([
            {
                created_by:3,
                challenge_id:1,
                attempts:1,
                completed:1,
                solution:`
function longestString(arr) {
  let result = '';
  for(let i = 0; i < arr.length;  i++){
    let currentItem = arr[i];
    if(currentItem.length > result.length){
      result = arr[i];
    }
  }
  return result;
}
                `
              },
              {
                created_by:4,
                challenge_id:1,
                attempts:2,
                completed:1,
                solution:`
function longestString(arr) {
  let result = '';
  for(let i = 0; i < arr.length;  i++){
    let currentItem = arr[i];
    if(currentItem.length > result.length){
      result = arr[i];
    }
  }
  return result;
}
                `
              },
              ,
              {
                created_by:5,
                challenge_id:1,
                attempts:3,
                completed:0,
                solution:`
function longestString(arr) {
  let result = '';
  for(let i = 0; i < arr.length;  i++){
    console.log(i);
  }
  return result;
}
                `
              }
        ]);
      });
  };