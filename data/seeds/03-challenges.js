
exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('challenges').del()
      .then(function () {
        // Inserts seed entries
        return knex('challenges').insert([
            {
              created_by: 3,
              title: "Longest String",
                description:`
Write a function that takes an array of strings and return the longest string in the array.

For example:
const strings1 = ['short', 'really, really long!', 'medium'];
console.log(longestString(strings1)); // <--- 'really, really long!'

Edge case: If you had an array which had two "longest" strings of equal length, your function should just return the first one.

For example:
const strings2 = ['short', 'first long string!!', 'medium', 'abcdefghijklmnopqr'];
console.log(longestString(strings2)); // <--- 'first long string!'
`,
              tests:`
describe("UnitTests", function() {
    it("longest_string_at_the_end_of_the_array", function() {
        expect(longestString(['a', 'bc', 'defg', 'hi', 'abcdefgh'])).toBe('abcdefgh');
        });
});
              `,
              skeleton_function:`
function longestString(arr) {

}
              `,
              solution:`
function longestString(arr) {
let result = '';
for(let i = 0; i < arr.length;  i++){
    let currentItem = arr[i];
    if(currentItem.length > result){
    result = arr[i];
    }
}
return result;
}
              `,
              difficulty:10,
              approved:1
            },
            {
                created_by: 3,
                title: "Reverse String",
                  description:`
Write a function called reverseString that accepts a string and returns a reversed copy of the string.

Input Example:
'hello world'
'asdf'
'CS rocks!'

Output Example:
'dlrow olleh'
'fdsa'
'!skcor SC'
  `,
                tests:`
describe("UnitTests", function() {
    it("returns_a_reversed_version_of_the_string_argument", function() {
        // Failure message: 
        // Try console.log()'ing your function. If you use "Bob" as an argument, does your function return "boB'?
        expect(reverseString('abc')).toBe('cba');
        expect(reverseString('Hello world')).toBe('dlrow olleH');
});
    it("returns_a_string", function() {
        // Failure message: 
        // Are you returning something besides a string?
        expect(typeof reverseString('abc')).toBe('string');
    });
});
                `,
                skeleton_function:`
function reverseString(str) {

}
                `,
                solution:`
function reverseString(str) {
    let len = str.length;
    let reversed = '';
    for (let i = len; i > 0; i--) {
        reversed += str[i - 1];
    }
    return reversed;
}
                `,
                difficulty:10,
                approved:1
              },
              {
                created_by: 1,
                title: "Reverse Number",
                  description:`
Write a function called reverseNumber that reverses a number.

Input Example: 
12345
555

Output Example:  
54321
555
  `,
                tests:`
describe("UnitTests", function() {
    it("should_return_a_reversed_number", function() {
        // Failure message: 
        // Your function should return a reversed version of the original number
        expect(reverseNumber(12345)).toBe(54321);
        expect(reverseNumber(555)).toBe(555);
        expect(reverseNumber(987)).toBe(789);
        });
    it("should_return_a_number", function() {
        // Failure message: 
        // Your function should return a number
        expect(typeof reverseNumber(15)).toBe('number');
    });
});
                `,
                skeleton_function:`
function reverseNumber(num) {

}
                `,
                solution:`
function reverseNumber (num) {
    let str = num.toString();
    let len = str.length;
    let reversed = '';
    for (let i = len; i > 0; i--) {
        reversed += str[i - 1];
    }
    let result = Number(reversed);
    return result;
}                  
                `,
                difficulty:10,
                approved:1
              }
        ]);
      });
  };
  