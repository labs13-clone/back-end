
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
\`\`\`
const strings1 = ['short', 'really, really long!', 'medium'];
console.log(longestString(strings1)); // <--- 'really, really long!'
\`\`\`
Edge case: If you had an array which had two "longest" strings of equal length, your function should just return the first one.

For example:
\`\`\`
const strings2 = ['short', 'first long string!!', 'medium', 'abcdefghijklmnopqr'];
console.log(longestString(strings2)); // <--- 'first long string!'
\`\`\``,
              tests:JSON.stringify([
                {
                descriptor:"longest_string_at_the_end_of_the_array",
                argumentsToPass:[['a', 'bc', 'defg', 'hi', 'abcdefgh']],
                expectedResult:'abcdefgh'
                },
            ])
              ,
              skeleton_function:
`function longestString(arr) {

}`,
              solution:
`function longestString(arr) {
    let result = '';
    for(let i = 0; i < arr.length;  i++){
        let currentItem = arr[i];
        if(currentItem.length > result.length){
        result = arr[i];
        }
    }
    return result;
}`,
              difficulty:10,
              approved:1
            },
            {
                created_by: 3,
                title: "Reverse String",
                  description:`
Write a function called reverseString that accepts a string and returns a reversed copy of the string.

Input Example:
\`\`\`
'hello world'
'asdf'
'CS rocks!'
\`\`\`

Output Example:
\`\`\`
'dlrow olleh'
'fdsa'
'!skcor SC'
\`\`\``,
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
                skeleton_function:
`function reverseString(str) {

}`,
                solution:
`function reverseString(str) {
    let len = str.length;
    let reversed = '';
    for (let i = len; i > 0; i--) {
        reversed += str[i - 1];
    }
    return reversed;
}`,
                difficulty:10,
                approved:1
              },
              {
                created_by: 1,
                title: "Reverse Number",
                  description:`
Write a function called reverseNumber that reverses a number.

Input Example: 
\`\`\`
12345
555
\`\`\`

Output Example:  
\`\`\`
54321
555
\`\`\``,

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
                skeleton_function:
`function reverseNumber(num) {

}`,
                solution:
`function reverseNumber (num) {
    let str = num.toString();
    let len = str.length;
    let reversed = '';
    for (let i = len; i > 0; i--) {
        reversed += str[i - 1];
    }
    let result = Number(reversed);
    return result;
}`,
                difficulty:10,
                approved:1
              },
              {
                created_by: 1,
                title: "Reverse Case",
                  description:`
Write a function that takes in a string, reverses the 'casing' of that string, and returns the "reversed-casing" string.

\`\`\`
const string = 'HELLO world!';
console.log(reverseCase(string)); // <--- hello WORLD!
\`\`\``,
            
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
                skeleton_function:
`function reverseCase(str) {

}`,
                solution:
`function reverseCase(str) {
    return str
    .split('')
    .map(function(char) {               //then                //else
        return char.toUpperCase() === char ? char.toLowerCase() : char.toUpperCase();
    })
    .join('');
}`,
                difficulty:15,
                approved:1
              },
              {
                created_by: 1,
                title: "Stringzzz",
                  description:`
Return the string "string" with as many Zs as the argument passed.

Input Example:  

\`\`\`
1
4
7
\`\`\`

Output Example:  

\`\`\`
'stringz'
'stringzzzz'
'stringzzzzzzz'
\`\`\``,
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
                skeleton_function:
`function stringZ(num) {

}`,
                solution:
`function stringZ(num) {
    const z = 'z'; 
    return 'string' + z.repeat(num)
}`,
                difficulty:16,
                approved:0
              },
        
              {

                created_by: 1,
                title: "To Camel case",
                  description:`
Complete the function so that it converts dash-delimited ("kebab" case) & underscore-delimited ("snake" case) words into "camel" casing. 

The first word within the output should be capitalized only if the original word was capitalized.
\`\`\`
toCamelCase("the-stealth-warrior")
// returns "theStealthWarrior"
toCamelCase("The_stealth_warrior")
// returns "TheStealthWarrior"
\`\`\``,
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
                skeleton_function:
`function toCamelCase(str){

}`,
                solution:
`function toCamelCase(str) {
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
}`,
                difficulty:20,
                approved:1
              },

              {

                created_by: 1,
                title: "Sort String",
                  description:`
Write a function called sortString that takes a string of letters and returns a string with the letters sorted in alphabetical order.

Input
\`\`\`
'dcba'
'zycxbwa'
'AzycxbCwBaA'
\`\`\`

Output
\`\`\`
'abcd'
'abcwxyz'
'AABCabcwxyz'
\`\`\``,
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
                      descriptor:"sorts uppercase before lowercase",
                      argumentsToPass:['AzycxbCwBaA'],
                      expectedResult:"AABCabcwxyz"
                      },
                      {
                        descriptor:"sorts uppercase before lowercase",
                        argumentsToPass:['bBaA'],
                        expectedResult:"ABab"
                      },
                      {
                          descriptor:"returns a string",
                          argumentsToPass:[''],
                          expectedResult:""
                      },
                ]),
                skeleton_function:
`function sortString(str) {

}`,
                solution:
`function sortString(str) {
  const arr = str.split('');
  const sorted = arr.sort();
  const joined = sorted.join('');
  return joined;
}`,
                difficulty:25,
                approved:1
              },

              {

                created_by: 1,
                title: "Vowel Count",
                  description:`
Write a function which counts the number of vowels in a given string. Return the count number.

Input
\`\`\`
'hello world'
\`\`\`

Output
\`\`\`
'3'
\`\`\``,
                tests:JSON.stringify([
                    {
                    descriptor:"discerns from the entire alphabet",
                    argumentsToPass:['The quick brown fox jumped over the lazy dog.'],
                    expectedResult:"12"
                    },
                    {
                      descriptor:"does not count consonants",
                      argumentsToPass:['-bcd-fgh-jklmn-pqrst-vwxyz-BCD-FGH-JKLMN-PQRST-VWXYZ'],
                      expectedResult:"0"
                    },
                    {
                        descriptor:"count UPPER and lower case vowels",
                        argumentsToPass:['aeiouAEIOU'],
                        expectedResult:"10"
                    },
                ]),
                skeleton_function:
`function vowelCount(str) {

}`,
                solution:
`function vowelCount(str) {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    // lowercase vowels
    if (str.charAt(i) === 'a') count++;
    if (str.charAt(i) === 'e') count++;
    if (str.charAt(i) === 'i') count++;
    if (str.charAt(i) === 'o') count++;
    if (str.charAt(i) === 'u') count++;
    // UPPERCASE vowels
    if (str.charAt(i) === 'A') count++;
    if (str.charAt(i) === 'E') count++;
    if (str.charAt(i) === 'I') count++;
    if (str.charAt(i) === 'O') count++;
    if (str.charAt(i) === 'U') count++;
  }
  return count;
}`,
                difficulty:25,
                approved:1
              },

              {

                created_by: 1,
                title: "Sum of Digits",
                  description:`
Write a function called sumOfDigits. When given a positive integer, sumOfDigits returns the sum of its digits.
Assume all numbers will be positive.

Input
\`\`\`
'23'
\`\`\`

Output
\`\`\`
'5'
\`\`\``,
                tests:JSON.stringify([
                    {
                    descriptor:"should_correctly_add_digits",
                    argumentsToPass:['23'],
                    expectedResult:"5"
                    },
                    {
                      descriptor:"should_correctly_add_digits",
                      argumentsToPass:['101010101'],
                      expectedResult:"5"
                    },
                ]),
                skeleton_function:
`function sumOfDigits(num) {

}`,
                solution:
`function sumOfDigits (num) {
  const integerStrings = ('' + num).split('');     // does the same thing as the next line
  // const integerStrings = String(num).split(''); // I find this reads better
  console.log(integerStrings);                     // <--- should return an array of strings
  console.log(typeof(integerStrings));             // <--- 'object' (JS arrays are special kinds of objects - Everything Is Objects!!!)
  // declaring variables to be used in the for loop
  const len = integerStrings.length;
  let i = 0,
    sum = 0;
  // For-Loop Love!
  for (i; i < len; i++) {
    sum += Number(integerStrings[i]); // <--- turns the strings into type: integers
    console.log(sum);                 // <--- sum of adding up all ints in the array of ints
  }
  return sum;
}`,
                difficulty:25,
                approved:1
              },

              {

                created_by: 1,
                title: "String Compression",
                  description:`
Implement a method to perform basic string compression using the counts of repeated characters.

Input
\`\`\`
'aabcccccaaa'
\`\`\`

Output
\`\`\`
'a2b1c5a3'
\`\`\``,
                tests:JSON.stringify([
                    {
                    descriptor:"abcd",
                    argumentsToPass:['abcd'],
                    expectedResult:"abcd"
                    },
                    {
                      descriptor:"aaaa",
                      argumentsToPass:['aaaa'],
                      expectedResult:"a4"
                    },
                    {
                        descriptor:"aaaaqqqqqqqqqwertyuiop",
                        argumentsToPass:['aaaaqqqqqqqqqwertyuiop'],
                        expectedResult:"aaaaqqqqqqqqqwertyuiop"
                    },
                    {
                      descriptor:"aaaaqqqqqqqqqwer",
                      argumentsToPass:['aaaaqqqqqqqqqwer'],
                      expectedResult:"a4q9w1e1r1"
                  },
                ]),
                skeleton_function:
`function stringCompression(str) {

}`,
                solution:
`function stringCompression(str) {
    let curChar = null;
    let cmpresd = '';
    let count = 1;
    for (let i = 0; i <= str.length; i++) {
      if (str[i] === curChar) count++;
      if (curChar === null) curChar = str[i];
      if (str[i] !== curChar || str[i] === undefined) {
        cmpresd += curChar;
        cmpresd += count;
        count = 1;
        curChar = str[i];
      }
    }
    return cmpresd.length < str.length ? cmpresd : str;
  }`,
                difficulty:40,
                approved:1
              },

              {

                created_by: 1,
                title: "Quick Sort",
                  description:`
Implement the quick sort sorting algorithm. Assume the input is an array of integers.

[Wikipedia](https://en.wikipedia.org/wiki/Quicksort)

[KhanAcademy](https://www.khanacademy.org/computing/computer-science/algorithms#quick-sort)

Input
\`\`\`
[9,8,7,6,5,4,3]
\`\`\`

Output
\`\`\`
[3,4,5,6,7,8,9]
\`\`\``,
                tests:JSON.stringify([
                    {
                    descriptor:"should_sort_an_array",
                    argumentsToPass:[[0,1,2,3,4,5,6]],
                    expectedResult:[0,1,2,3,4,5,6]
                    },
                    {
                      descriptor:"should_sort_an_array",
                      argumentsToPass:[[9,8,7,6,5,4,3]],
                      expectedResult:[3,4,5,6,7,8,9]
                    },
                    {
                        descriptor:"should_be_able_to_handle_negative_numbers",
                        argumentsToPass:[[55,-5,-10,4]],
                        expectedResult:[-10,-5,4,55]
                    },
                    {
                      descriptor:"should_be_able_to_handle_multiple_occurrences_of_same_number",
                      argumentsToPass:[[9,5,5,5,5,5,1]],
                      expectedResult:[1,5,5,5,5,5,9]
                  },
                ]),
                skeleton_function:
`function quickSort(nums) {

}`,
                solution:
`function quickSort(nums) {
  const arr = nums.slice();
  if (nums.length < 2) return nums;
  
  const lessThanOrEqualToPivot = [];
  const greaterThanPivot = [];
  const middleIndex = Math.floor(arr.length / 2);
  const pivot = arr.splice(middleIndex, 1);

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] <= pivot[0]) {
      lessThanOrEqualToPivot.push(arr[i]);
    } else {
      greaterThanPivot.push(arr[i]);
    }
  }

  return [].concat(quickSort(lessThanOrEqualToPivot), pivot, quickSort(greaterThanPivot));
}`,
                difficulty:60,
                approved:1
              },

              {

                created_by: 1,
                title: "Insertion Sort",
                  description:`
Insertion sort is a basic sorting algorithm.

Insertion sort iterates over an array, growing a sorted array behind the current location.

It takes each element from the input and finds the spot, up to the current point, where that element belongs.

It does this until it gets to the end of the array.

Input
\`\`\`
[12, 44, 10, 2, 35, 1098, 356]
\`\`\`

Output
\`\`\`
[2, 44, 10, 35, 356, 12, 1098]
\`\`\``,
                tests:JSON.stringify([
                    {
                    descriptor:"unsorted_array2",
                    argumentsToPass:[[1, 34, 111, 250, 157, 12]],
                    expectedResult:[1, 12, 34, 111, 157, 250]
                    },
                    {
                      descriptor:"simple_array_from_one_to_five_backwards_with_repeating_numbers",
                      argumentsToPass:[[5,5,5,4,4,4,3,3,3,2,2,2,1,1,1]],
                      expectedResult:[1,1,1,2,2,2,3,3,3,4,4,4,5,5,5]
                    },
                    {
                        descriptor:"unsorted_array",
                        argumentsToPass:[[2, 1, 3, 7, 4, 2, 9, 3, 8]],
                        expectedResult:[1, 2, 2, 3, 3, 4, 7, 8, 9]
                    },
                    {
                      descriptor:"simple_array_from_1_to_5_backwards",
                      argumentsToPass:[[5,4,3,2,1]],
                      expectedResult:[1,2,3,4,5]
                  },
                ]),
                skeleton_function:
`function insertionSort(array) {

}`,
                solution:
`function insertionSort(array) {
  for (let i = 1; i < array.length; i++) {
    let temp = array[i];
    let j;
    for (j = i - 1; j >= 0 && array[j] > temp; j--) {
      array[j + 1] = array[j];
    }
    array[j + 1] = temp;
  }
  return array;
}`,
                difficulty:30,
                approved:1
              },
              {

                created_by: 1,
                title: "To Binary String",
                  description:`
 Given a positive (or 0) number, return a string of 1's and 0's representing it's binary value:
toBinaryString(6) should return "110" (no leading 0).

Input
\`\`\`
console.log(toBinaryString(9));
\`\`\`

Output
\`\`\`
1001
\`\`\``,
                tests:JSON.stringify([
                    {
                      descriptor:"array_containing_both_negative_and_positive_numbers",
                      argumentsToPass:[0],
                      expectedResult:"0"
                    },
                    {
                      descriptor:"Base_Tests",
                      argumentsToPass:[9],
                      expectedResult:"1001"
                    },
                    {
                      descriptor:"Base_Tests",
                      argumentsToPass:[5],
                      expectedResult:"101"
                    },
                    {
                      descriptor:"Base_Tests",
                      argumentsToPass:[8],
                      expectedResult:"1000"
                    },
                    {
                      descriptor:"Base_Tests",
                      argumentsToPass:[6],
                      expectedResult:"110"
                    },
                ]),
                skeleton_function:
`function toBinaryString(number) {
  
}`,
                solution:
`function toBinaryString(number) {
  let num = Number(number); // Input remains unaltered
  let result = '';
  if (number === 0) return '0';
  while (num > 0) {
    result = (num % 2) + result;
    num = Math.floor(num / 2);
  }
  console.log(number, num); // Input remains unaltered
  return result;
}`,
                difficulty:60,
                approved:1
              },
              {

                created_by: 1,
                title: "Roman Numeralize",
                  description:`
Define a function that takes in a positive integer and returns the Roman Numeral representation of that number.  

Input
\`\`\`
Symbol    Value
  I         1
  IV        4
  V         5
  IX        9
  X         10
  XL        40
  L         50
  XC        90
  C         100
  CD        400
  D         500
  CM        900
  M         1,000  
\`\`\``,
                tests:JSON.stringify([
                    {
                      descriptor:"Given_numbers_ranging_from_10_to_2009_should_return_roman_numerals_for_each_number_inputted",
                      argumentsToPass:[11],
                      expectedResult:"XI"
                    },
                    {
                      descriptor:"Given_numbers_ranging_from_10_to_2009_should_return_roman_numerals_for_each_number_inputted",
                      argumentsToPass:[22],
                      expectedResult:"XXII"
                    },
                    {
                      descriptor:"Given_numbers_ranging_from_10_to_2009_should_return_roman_numerals_for_each_number_inputted",
                      argumentsToPass:[1000],
                      expectedResult:"M"
                    },
                    {
                      descriptor:"Given_numbers_ranging_from_10_to_2009_should_return_roman_numerals_for_each_number_inputted",
                      argumentsToPass:[1001],
                      expectedResult:"MI"
                    },
                    {
                      descriptor:"Given_numbers_ranging_from_10_to_2009_should_return_roman_numerals_for_each_number_inputted",
                      argumentsToPass:[1990],
                      expectedResult:"MCMXC"
                    },
                    {
                      descriptor:"Given_numbers_ranging_from_10_to_2009_should_return_roman_numerals_for_each_number_inputted",
                      argumentsToPass:[2007],
                      expectedResult:"MMVII"
                    },
                    {
                      descriptor:"Given_numbers_ranging_from_10_to_2009_should_return_roman_numerals_for_each_number_inputted",
                      argumentsToPass:[2008],
                      expectedResult:"MMVIII"
                    },
                    {
                      descriptor:"Given_numbers_ranging_from_10_to_2009_should_return_roman_numerals_for_each_number_inputted",
                      argumentsToPass:[59],
                      expectedResult:"LIX"
                    },
                    {
                      descriptor:"Given_numbers_ranging_from_10_to_2009_should_return_roman_numerals_for_each_number_inputted",
                      argumentsToPass:[95],
                      expectedResult:"XCV"
                    },
                    {
                      descriptor:"Given_numbers_ranging_from_10_to_2009_should_return_roman_numerals_for_each_number_inputted",
                      argumentsToPass:[50],
                      expectedResult:"L"
                    },
                    {
                      descriptor:"Given_numbers_ranging_from_10_to_2009_should_return_roman_numerals_for_each_number_inputted",
                      argumentsToPass:[45],
                      expectedResult:"XLV"
                    },
                    {
                      descriptor:"Given_numbers_ranging_from_10_to_2009_should_return_roman_numerals_for_each_number_inputted",
                      argumentsToPass:[591],
                      expectedResult:"DXCI"
                    },
                    {
                      descriptor:"Given_numbers_ranging_from_10_to_2009_should_return_roman_numerals_for_each_number_inputted",
                      argumentsToPass:[985],
                      expectedResult:"CMLXXXV"
                    },

                ]),
                skeleton_function:
`function romanNumeralize(n) {

}`,
                solution:
`function romanNumeralize(n) {
  let number = n;
  const rome = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I']
];
// BASE CASE
if (number === 0) {
  return '';
}
for (let i = 0; i < rome.length; i++) {
  if (number >= rome[i][0]) {
  // RECURSIVE FUNCTION CALL
  return rome[i][1] + romanNumeralize(number - rome[i][0]);
    }
  }
}`,
                difficulty:60,
                approved:1
              },
              {

                created_by: 1,
                title: "Next Palindromic Number",
                  description:`
Given a number, find the next smallest palindrome number larger than the number. 

Input
\`\`\`
125
\`\`\`

Output
\`\`\`
131
\`\`\``,
                tests:JSON.stringify([
                    {
                      descriptor:"should_return_131_given_125",
                      argumentsToPass:[125],
                      expectedResult:"131"
                    },
                    {
                      descriptor:"should_not_return_a_negative_number",
                      argumentsToPass:[-55],
                      expectedResult:"0"
                    },
                ]),
                skeleton_function:
`function nextPalindrome(n) {
  
}`,
                solution:
`function nextPalindrome(n) {
  let search = true;
  let m = n + 1;
  while (search) {
    if ((m + '') === (m + '').split('').reverse().join('')) return m;
    m++;
  }
}`,
                difficulty:60,
                approved:1
              },
              {
                created_by: 1,
                title: "Largest Contiguous Sum",
                  description:`
Given an array of numbers containing at least one positive number (or zero),
 find the greatest contiguous sum of numbers.
Input
\`\`\`
[1, 2, 3]
\`\`\`

Output
\`\`\`
6
\`\`\``,
                tests:JSON.stringify([
                    {
                      descriptor:"array_containing_both_negative_and_positive_numbers",
                      argumentsToPass:[[-5,0,6,-9,-2,11,5,-12,6]],
                      expectedResult:"16"
                    },
                    {
                      descriptor:"array_containing_4_neg1_5",
                      argumentsToPass:[[4,-1,5]],
                      expectedResult:"8"
                    },
                    {
                      descriptor:"array_containing_1_2_3",
                      argumentsToPass:[[1,2,3]],
                      expectedResult:"6"
                    },
                    {
                      descriptor:"array_containing_10_neg11_11",
                      argumentsToPass:[[10, -11, 11]],
                      expectedResult:"11"
                    },
                ]),
                skeleton_function:
`function sumArray(arr) {
  
}`,
                solution:
`function sumArray(arr) {
  let ans = 0;
  let sum = 0;

  for (let i = 0; i < arr.length; i++) {
    ans = Math.max(0, ans + arr[i]);
    sum = Math.max(sum, ans);
  }

  return sum;
}`,
                difficulty:60,
                approved:1
              },
              {
                created_by: 1,
                title: "Bubble sort",
                  description:`
Bubble sort is the most basic sorting algorithm.
It compares the first element of an array with the second element.
If the first element is greater than the second element then it swaps them.
Then it compares the second and third elements and swaps them if the second is larger.
Then it compares the third and fourth elements and does the same.
This continues and the the larger elements begin to "bubble" towards the end.
The loop then restarts and repeats this process until it makes a clean pass
without performing any swaps.
Input
\`\`\`
[2, 1, 3]
\`\`\`

Output
\`\`\`
[1, 2, 3]
\`\`\``,
                tests:JSON.stringify([
                    {
                      descriptor:"should_sort_an_array_with_two_items",
                      argumentsToPass:[[4,1]],
                      expectedResult:[1,4]
                    },
                    {
                      descriptor:"should_sort_an_array_with_two_items",
                      argumentsToPass:[[3,2]],
                      expectedResult:[2,3]
                    },
                    {
                      descriptor:"should_sort_an_array_with_two_items",
                      argumentsToPass:[[-5,5]],
                      expectedResult:[-5,5]
                    },
                    {
                      descriptor:"should_sort_an_array_with_three_or_more_items",
                      argumentsToPass:[[4,1,2,3]],
                      expectedResult:[1,2,3,4]
                    },
                    {
                      descriptor:"should_sort_an_array_with_three_or_more_items",
                      argumentsToPass:[[9,8,7,6,5,4,3,2,1]],
                      expectedResult:[1,2,3,4,5,6,7,8,9]
                    },
                ]),
                skeleton_function:
`function bubbleSort(arr) {
  
}`,
                solution:
`function bubbleSort(arr) {
  let swappedValue;
  do {
    swappedValue = false;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        let temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        swappedValue = true;
      }
    }
  } while (swappedValue);
  return arr;
}`,
                difficulty:60,
                approved:1
              },
              {
                created_by: 1,
                title: "Even Occurrences",
                  description:`
Find the first item that occurs an even number of times in an array.

Remember to handle multiple even-occurrence items and return the first one.

Return null if there are no even-occurrence items.
                  
Input
\`\`\`
[1, 7, 2, 4, 5, 6, 8, 9, 6, 4]
\`\`\`

Output
\`\`\`
4
\`\`\``,
                tests:JSON.stringify([
                    {
                      descriptor:"Should_return_a_number_if_it_occurs_even_amount_of_times",
                      argumentsToPass:[[1, 7, 2, 4, 5, 6, 8, 9, 4]],
                      expectedResult:"4"
                    },
                    {
                      descriptor:"should_sort_an_array_with_two_items",
                      argumentsToPass:[[1, 7, 2, 4, 5, 6, 8, 9, 1]],
                      expectedResult:"1"
                    },
                    {
                      descriptor:"should_sort_an_arshould_handle_multiple_even_occurrences_by_returning_the_first_even_occurring_numberray_with_two_items",
                      argumentsToPass:[[1, 7, 2, 4, 5, 6, 8, 9, 6, 4, 1]],
                      expectedResult:"1"
                    },
                    {
                      descriptor:"should_sort_an_array_with_three_or_more_items",
                      argumentsToPass:[[1, 7, 2, 4, 5, 6, 8, 9, 6, 4, 2]],
                      expectedResult:"2"
                    },
                    {
                      descriptor:"should_sort_an_array_with_three_or_more_items",
                      argumentsToPass:[[1, 7, 2, 4, 5, 6, 7, 4, 6, 7, 7]],
                      expectedResult:"7"
                    },
                ]),
                skeleton_function:
`function evenOccurrence(arr) {
  
}`,
                solution:
`function evenOccurrence(arr) {
  const obj = {};
  for (let i = 0; i < arr.length; i++) {
    if (obj[arr[i]] === undefined) {
      obj[arr[i]] = 1;
    }
    else if (obj[arr[i]] === 1) {
      obj[arr[i]] = 2;
    }
    else if (obj[arr[i]] === 2) {
      obj[arr[i]] = 1;
    }
  }
  for (let i = 0; i < arr.length; i++) {
    if (obj[arr[i]] === 2) {
      return arr[i];
    }
  }
  return null;
}`,
                difficulty:60,
                approved:1
              },
              {
                created_by: 1,
                title: "Days Between",
                  description:`
Calculate and return the number of days between two dates as a string.

Dates may be in any combination of ISO, short or long formats.
                  
Input
\`\`\`
'11/05/2017', '11/04/2017'
\`\`\`

Output
\`\`\`
'-1'
\`\`\``,
                tests:JSON.stringify([
                    {
                      descriptor:"should_return_negative_number_if_days_are_inverted",
                      argumentsToPass:['11/05/2017', '11/04/2017'],
                      expectedResult:'-1'
                    },
                    {
                      descriptor:"should_return_date_as_string",
                      argumentsToPass:['Nov 4, 2017', '11/05/2017'],
                      expectedResult:"1"
                    },
                    {
                      descriptor:"should_process_mixed_formats",
                      argumentsToPass:['November 4, 2017', '5 Nov, 2017'],
                      expectedResult:"1"
                    },
                    {
                      descriptor:"should_return_zero_when_dates_match",
                      argumentsToPass:['Nov 4, 2017', '11/04/2017'],
                      expectedResult:"0"
                    },
                ]),
                skeleton_function:
`function daysBetween (start, end) {
  
}`,
                solution:
`function daysBetween (start, end) {
  return ((Date.parse(end) - Date.parse(start))/(1000 * 60 * 60 * 24)).toString();
}`,
                difficulty:60,
                approved:1
              },

        ]);
      });
  };


