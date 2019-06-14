
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
\`\`\`const strings1 = ['short', 'really, really long!', 'medium'];
console.log(longestString(strings1)); // <--- 'really, really long!'
\`\`\`
Edge case: If you had an array which had two "longest" strings of equal length, your function should just return the first one.

For example:
\`\`\`const strings2 = ['short', 'first long string!!', 'medium', 'abcdefghijklmnopqr'];
console.log(longestString(strings2)); // <--- 'first long string!'
\`\`\`
`,
              tests:JSON.stringify([
                {
                descriptor:"longest_string_at_the_end_of_the_array",
                argumentsToPass:[['a', 'bc', 'defg', 'hi', 'abcdefgh']],
                expectedResult:'abcdefgh'
                },
            ])
              ,
              skeleton_function:`
function longestString(arr) {

}
              `,
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
\`\`\`'hello world'
'asdf'
'CS rocks!'
\`\`\`

Output Example:
\`\`\`'dlrow olleh'
'fdsa'
'!skcor SC'
\`\`\`
  `,
                tests:JSON.stringify([
                    {
                    descriptor:"Returns a reversed version of the string argument",
                    argumentsToPass:['abc'],
                    expectedResult:'cba'
                    },
                    {
                    descriptor:"Returns a reversed version of the string argument",
                    argumentsToPass:['Hello world'],
                    expectedResult:'dlrow olleH'
                    }
                ])
                ,
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
\`\`\`12345
555
\`\`\`

Output Example:  
\`\`\`54321
555
\`\`\`
  `,

                tests:JSON.stringify([
                    {
                    descriptor:"Returns a reversed version of the original number",
                    argumentsToPass:[12345],
                    expectedResult:54321
                    },
                    {
                    descriptor:"Returns a reversed version of the original number",
                    argumentsToPass:[555],
                    expectedResult:555
                    },
                    {
                    descriptor:"Returns a reversed version of the original number",
                    argumentsToPass:[987],
                    expectedResult:789
                    }
                ]),
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
              },
              {
                created_by: 1,
                title: "Reverse Case",
                  description:`
Write a function that takes in a string, reverses the 'casing' of that string, and returns the "reversed-casing" string.

\`\`\`const string = 'HELLO world!';
console.log(reverseCase(string)); // <--- hello WORLD!
\`\`\`
            `,
            
                tests:JSON.stringify([
                    {
                    descriptor:"Handles non alphabet character",
                    argumentsToPass:["HELLO world!"],
                    expectedResult:"hello WORLD!"
                    },
                    {
                    descriptor:"Reverse the string case",
                    argumentsToPass:["HELLO world"],
                    expectedResult:"hello WORLD"
                    },
                    {
                    descriptor:"Reverse the string case",
                    argumentsToPass:["ONE more TEST"],
                    expectedResult:"one MORE test"
                    }
                ]),
                skeleton_function:`
function reverseCase(str) {

}
                `,
                solution:`
function reverseCase(str) {
    return str
    .split('')
    .map(function(char) {               //then                //else
        return char.toUpperCase() === char ? char.toLowerCase() : char.toUpperCase();
    })
    .join('');
}         
                `,
                difficulty:15,
                approved:1
              },
              {
                created_by: 1,
                title: "Common Elements",
                  description:`
Write a function called commonElements that has parameters for two arrays.
Return an array of all items that are present in both arrays.
Do not modify the arrays that are passed in.

Input Example:  
\`\`\`
[1, 2, 3, 4] [3, 4, 5, 6]
['a', 'b', 'c'] ['x', 'y', 'z', 'a']
[1, 2, 3] [4, 5, 6]
\`\`\`

Output Example:  
\`\`\`
[3, 4]
['a']
[]
\`\`\`
            `,
                tests:JSON.stringify([
                    {
                    descriptor:"Returns an array of common elements for numbers",
                    argumentsToPass:[[1, 2, 3, 4, 5], [4, 5, 6, 7]],
                    expectedResult:[4, 5]
                    },
                    {
                    descriptor:"Returns an array of common elements for strings",
                    argumentsToPass:[['a', 'b', 'c'], ['x', 'y', 'z', 'a']],
                    expectedResult:["a"]
                    },
                ]),
                skeleton_function:`
function commonElements(arr1, arr2) {

}
                `,
                solution:`
function commonElements(arr1, arr2) {
    return arr1.filter((item, index) => {
        if (arr1.indexOf(item) === index){
            return arr2.includes(item);
        }
    });
}         
                `,
                difficulty:40,
                approved:1
              }
        ]);
      });
  };


