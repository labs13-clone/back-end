
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
                title: "Stringzzz",
                  description:`
## Return the string "string" with as many Zs as the argument passed.

### Input Example:  

\`\`\`1
4
7\`\`\`

### Output Example:  

\`\`\`'stringz'
'stringzzzz'
'stringzzzzzzz'\`\`\`
            `,
                tests:JSON.stringify([
                    {
                    descriptor:"Returns 1z",
                    argumentsToPass:[1],
                    expectedResult:"stringz"
                    },
                    {
                      descriptor:"Returns 3z",
                      argumentsToPass:[3],
                      expectedResult:"stringzzz"
                      },
                ]),
                skeleton_function:`
function stringZ(num) {

}
                `,
                solution:`
function stringZ(num) {
    const z = 'z'; 
    return 'string' + z.repeat(num)
}          
                `,
                difficulty:16,
                approved:0
              },
        
              {

                created_by: 1,
                title: "To Camel case",
                  description:`
## Complete the function so that it converts dash-delimited ("kebab" case) & underscore-delimited ("snake" case) words into "camel" casing. 

The first word within the output should be capitalized only if the original word was capitalized.
\`\`\`toCamelCase("the-stealth-warrior")
// returns "theStealthWarrior"
toCamelCase("The_stealth_warrior")
// returns "TheStealthWarrior"
\`\`\`
            `,
                tests:JSON.stringify([
                    {
                    descriptor:"Should return empty string provided empty string",
                    argumentsToPass:[''],
                    expectedResult:""
                    },
                    {
                      descriptor:"Should accept underscore as well as hyphen",
                      argumentsToPass:['the_stealth_warrior'],
                      expectedResult:"theStealthWarrior"
                    },
                    {
                        descriptor:"Should accept underscore as well as hyphen",
                        argumentsToPass:['The-Stealth-Warrior'],
                        expectedResult:"TheStealthWarrior"
                    },
                ]),
                skeleton_function:`
function toCamelCase(str){

}
               `,
                solution:`
function toCamelCase(str) {
   if (str === '') return str;
    let snakeCase = str[0];
    strArr = str.split('');
    for (let i = 1; i < strArr.length; i++) {
      if (strArr[i] === '-') {
        strArr[i + 1] = strArr[i + 1].toUpperCase();
      }
      else if (strArr[i] === '_') {
        strArr[i + 1] = strArr[i + 1].toUpperCase();
      }
      else snakeCase += strArr[i];
    }
    return snakeCase;
}       
                `,
                difficulty:20,
                approved:1
              },

              {

                created_by: 1,
                title: "Sort String",
                  description:`
##  Write a function called sortString that takes a string of letters and returns a string with the letters sorted in alphabetical order.


Input
\`\`\`'dcba'
'zycxbwa'
'AzycxbCwBaA'
//
Output
'abcd'
'abcwxyz'
'AABCabcwxyz'
// 
\`\`\`
            `,
                tests:JSON.stringify([
                    {
                    descriptor:"returns string with letters in alphabetical order",
                    argumentsToPass:['cba'],
                    expectedResult:"abc"
                    },
                    {
                      descriptor:"returns string with letters in alphabetical order",
                      argumentsToPass:['ccc'],
                      expectedResult:"ccc"
                    },
                    {
                        descriptor:"returns string with letters in alphabetical order",
                        argumentsToPass:['zzyyxxww'],
                        expectedResult:"wwxxyyzz"
                    },
                    {
                      descriptor:"sorts_uppercase_before_lowercase",
                      argumentsToPass:['AzycxbCwBaA'],
                      expectedResult:"AABCabcwxyz"
                      },
                      {
                        descriptor:"sorts_uppercase_before_lowercase",
                        argumentsToPass:['bBaA'],
                        expectedResult:"ABab"
                      },
                      {
                          descriptor:"returns a string",
                          argumentsToPass:[''],
                          expectedResult:""
                      },
                ]),
                skeleton_function:`
function sortString(str) {
  
}
         
}
               `,
                solution:`
function sortString(str) {
  const arr = str.split('');
  const sorted = arr.sort();
  const joined = sorted.join('');
  return joined;
}
                     
                `,
                difficulty:25,
                approved:1
              },

        ]);
      });
  };


