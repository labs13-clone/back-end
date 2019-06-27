
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
              {

                created_by: 1,
                title: "Deep Equality",
                  description:`
 Write a function that, given two objects, returns whether or not the two are deeply equivalen
  - meaning the contents of the two objects are equal for all keys and sub-keys.

Input
\`\`\`
const johnA = {
  name: 'John',
  address: {
    line1: '321 Anytown',
    line2: 'Stoke-on-Trent'
  }
};

const johnB = {
  name: 'John',
  address: {
    line1: '321 Anytown',
    line2: 'Stoke-on-Trent'
  }
};

const johnC = {
  name: 'John Charles',
  address: {
    line1: '321 Anytown',
    line2: 'Stoke-on-Trent'
  }
};
\`\`\`

Output
\`\`\`
deepEquals(johnA, johnB); // true
deepEquals(johnA, johnC); // false
\`\`\``,
                tests:JSON.stringify([
                    {
                      descriptor:"deep_equals_should_return_false",
                      argumentsToPass:[{
                        name: 'John',
                        address: {
                          line1: '321 Anytown',
                          line2: 'Stoke-on-Trent'
                        }}, {
                          name: 'John Charles',
                          address: {
                            line1: '321 Anytown',
                            line2: 'Stoke-on-Trent'
                          }}],
                      expectedResult:false
                    },
                    {
                      descriptor:"deep_equals_should_return_true",
                      argumentsToPass:[{
                        name: 'John',
                        address: {
                          line1: '321 Anytown',
                          line2: 'Stoke-on-Trent'
                        }}, {
                        name: 'John',
                        address: {
                          line1: '321 Anytown',
                          line2: 'Stoke-on-Trent'
                        }}],
                      expectedResult:true
                    },
                ]),
                skeleton_function:
`function deepEquals(obj1, obj2) {
  
}`,
                solution:
`function deepEquals(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}`,
              difficulty:60,
                approved:1
            },
            {

              created_by: 1,
              title: "Armstrong Numbers",
                description:`
An Armstrong number is an n-digit number that is equal to the sum of the n'th powers of its digits. Determine if the input number is an Armstrong number.  Return either true or false .
true

Input
\`\`\`
6
153
351
\`\`\`

Output
\`\`\`
true
true
false
\`\`\``,
              tests:JSON.stringify([
                  {
                    descriptor:"should_return_true_for_armstrong_numbers",
                    argumentsToPass:[153],
                    expectedResult:true
                  },
                  {
                    descriptor:"should_return_true_for_armstrong_numbers",
                    argumentsToPass:[370],
                    expectedResult:true
                  },
                  {
                    descriptor:"should_return_true_for_armstrong_numbers",
                    argumentsToPass:[371],
                    expectedResult:true
                  },
                  {
                    descriptor:"should_return_true_for_armstrong_numbers",
                    argumentsToPass:[407],
                    expectedResult:true
                  },
                  {
                    descriptor:"should_return_true_for_armstrong_numbers",
                    argumentsToPass:[5],
                    expectedResult:true
                  },
                  {
                    descriptor:"should_return_true_for_zero_and_one",
                    argumentsToPass:[0],
                    expectedResult:true
                  },
                  {
                    descriptor:"should_return_true_for_armstrong_numbers",
                    argumentsToPass:[1],
                    expectedResult:true
                  },
                  {
                    descriptor:"should_return_false_for_non_armstrong_numbers",
                    argumentsToPass:[15],
                    expectedResult:false
                  },
                  {
                    descriptor:"should_return_false_for_non_armstrong_numbers",
                    argumentsToPass:[999],
                    expectedResult:false
                  },
                  {
                    descriptor:"should_return_false_for_non_armstrong_numbers",
                    argumentsToPass:[10],
                    expectedResult:false
                  },
              ]),
              skeleton_function:
`function isArmstrongNumber(n) {

}`,
              solution:
`function isArmstrongNumber(n) {
  let nums = n.toString().split('');
   nums = nums.map(num => Math.pow(parseInt(num), nums.length));
   const sum = nums.reduce((num, total) => num + total);
   return n === sum;
 }`,
              difficulty:60,
              approved:1
            },
            {

              created_by: 1,
              title: "Twin Primes ",
                description:`
A twin prime is a prime number that differs from another prime number by two.
Write a function called isTwinPrime which takes an integer and returns true if it is a twin prime, or false if it is not.

Input
\`\`\`
5 is a prime, and 5 + 2 = 7, which is also a prime, so returns true.
9 is not a prime, and so does not need checking, so it returns false.
7 is a prime, but 7 + 2 = 9, which is not a prime. However, 7 - 2 = 5, which is a prime, so it returns true.
23 is a prime, but 23 + 2 is 25, which is not a prime.  23 - 2 is 21, which isn't a prime either, so 23 is not a twin prime.
\`\`\``,
              tests:JSON.stringify([
                  {
                    descriptor:"given_2_it_should_return_false",
                    argumentsToPass:[2],
                    expectedResult:false
                  },
                  {
                    descriptor:"given_19_it_should_return_true",
                    argumentsToPass:[19],
                    expectedResult:true
                  },
                  {
                    descriptor:"given_5_it_should_return_true",
                    argumentsToPass:[5],
                    expectedResult:true
                  },
              ]),
              skeleton_function:
`function isTwinPrime(n) {

}`,
              solution:
`function isTwinPrime(n) {
  function isPrime(num) {
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return num >= 2;
  }
  return (isPrime(n) && (isPrime(n - 2) || isPrime(n + 2)));
}`,
              difficulty:60,
              approved:1
            },
            {

              created_by: 1,
              title: "Equal Sides",
                description:`
Write a function that returns the index of the given array at which the sums of the numbers on either side of it are equal to each other. 

Input
\`\`\`
equalSides([1, 2, 3, 4, 3, 2, 1]);
\`\`\`

Output
\`\`\`
should return 3 because the sums of the numbers on either side of arr[3] are both equal to 6. (1+2+3 (4) 3+2+1)
\`\`\``,
              tests:JSON.stringify([
                  {
                    descriptor:"should_return_index_of_center_digit",
                    argumentsToPass:[[2, 1, 5, 9, 8]],
                    expectedResult:'3'
                  },
                  {
                    descriptor:"should_return_neg1_if_none_found",
                    argumentsToPass:[[1, 2, 36, 8, 2]],
                    expectedResult:'-1'
                  },
              ]),
              skeleton_function:
`function equalSides (arr) {

 }`,
              solution:
`function equalSides (arr) {
  function reduceSide (side) {
    return side.reduce(function(result, currentNum, index, side){
      return result + currentNum;
    }, 0);
  }
  for (var i = 1; i < arr.length; i++) {
    var a = arr.slice(0, i);
    var b = arr.slice(i+1, arr.length);
    if (reduceSide(a) === reduceSide(b)) {
      return i;
    }
  }
  return -1;
}`,
              difficulty:60,
              approved:1
            },
            {

              created_by: 1,
              title: "Expanded Numbers",
                description:`
 Write a function that accepts a number and returns it in a string as it's expanded form.
Input
\`\`\`
562
\`\`\`

Output
\`\`\`
500 + 60 + 2
\`\`\``,
              tests:JSON.stringify([
                  {
                    descriptor:"should_not_expand_zeroes",
                    argumentsToPass:[70802],
                    expectedResult:'70000 + 800 + 2'
                  },
                  {
                    descriptor:"should_return_expanded_number",
                    argumentsToPass:[22],
                    expectedResult:'20 + 2'
                  },
              ]),
              skeleton_function:
`function expandedNums(num) {

}`,
              solution:
`function expandedNums (num) {
  return num.toString().split('').reduce(function (currentVal, nextVal, index, array) {
    if (array[index] === '0') {
      return currentVal + nextVal;
    }
  return currentVal + '0'.repeat(array.length - index) + ' + ' + nextVal;
  });
}`,
              difficulty:60,
              approved:1
            },
            {

              created_by: 1,
              title: "prime list",
                description:`
Write a function that generates a list of all prime numbers in a specified range (inclusive). 


Input
\`\`\`
(100, 150)
\`\`\`

Output
\`\`\`
[ 101, 103, 107, 109, 113, 127, 131, 137, 139, 149 ]
\`\`\``,
              tests:JSON.stringify([
                  {
                    descriptor:"100_to_150",
                    argumentsToPass:[100, 150],
                    expectedResult:[ 101, 103, 107, 109, 113, 127, 131, 137, 139, 149 ]
                  },
                  {
                    descriptor:"10_to_100",
                    argumentsToPass:[10,100],
                    expectedResult:[ 11,
                      13,
                      17,
                      19,
                      23,
                      29,
                      31,
                      37,
                      41,
                      43,
                      47,
                      53,
                      59,
                      61,
                      67,
                      71,
                      73,
                      79,
                      83,
                      89,
                      97 ]
                  },
                  {
                    descriptor:"1000_to_1050",
                    argumentsToPass:[1000, 1050],
                    expectedResult:[ 1009, 1013, 1019, 1021, 1031, 1033, 1039, 1049 ]
                  },
              ]),
              skeleton_function:
`function primeList(start, end) {
  
}`,
              solution:
`function primeList(start, end) {
  const primes = [];
  const upperLimit = Math.sqrt(end);
  const output = [];

  for (let i = 0; i <= end; i++) {
    primes.push(true);
  }

  for (let i = 2; i <= upperLimit; i++) {
    if (primes[i]) {
      for (let j = i * i; j <= end; j += i) {
        // console.log(i);
        primes[j] = false;
      }
    }
  }

  for (let i = 2; i <= end; i++) {
    if (primes[i] && i >= start) output.push(i);
  }

  return output;
}`,
              difficulty:60,
              approved:1
            },
            {

              created_by: 1,
              title: "Sum and Product",
                description:`
Given a sum and a product,
find two integers x and y, where x + y === sum, and x * y === product.
  You will return this in an array.


Input
\`\`\`
(6, 9)
\`\`\`

Output
\`\`\`
[3, 3]
\`\`\``,
              tests:JSON.stringify([
                  {
                    descriptor:"should_return_an_array_of_answers_for_each_of_these_sum_and_multiply",
                    argumentsToPass:[13, 12],
                    expectedResult:[1, 12]
                  },
                  {
                    descriptor:"should_return_an_array_of_answers_for_each_of_these_sum_and_multiply",
                    argumentsToPass:[50, 0],
                    expectedResult:[0, 50]
                  },
                  {
                    descriptor:"should_return_an_array_of_answers_for_each_of_these_sum_and_multiply",
                    argumentsToPass:[36, 180],
                    expectedResult:[6, 30]
                  },
                  {
                    descriptor:"should_return_an_array_of_answers_for_each_of_these_sum_and_multiply",
                    argumentsToPass:[300, 0],
                    expectedResult:[0, 300]
                  },
                  {
                    descriptor:"should_return_an_array_of_answers_for_each_of_these_sum_and_multiply",
                    argumentsToPass:[100, 99],
                    expectedResult:[1, 99]
                  },
              ]),
              skeleton_function:
`function sumAndProduct(sum, product) {
  
}`,
              solution:
`function sumAndProduct(sum, product) {
  for (let i = 0; i <= sum / 2; i++) {
    if (i * (sum - i) === product) return [i, (sum - i)];
  }
  return null;
} `,
              difficulty:60,
              approved:1
            },
            {

              created_by: 1,
              title: "Prime Reduction",
                description:`
                Given a range of integers from a to b (but not including b),
                 primeReduction should return how many primes within that range are capable of being reduced to 1.
                 In mathematical notation: [a, b) indicates that the "b" integer is excluded,
                  e.g. [2, 8) would be the range 2, 3, 4, 5, 6, 7.


Input
\`\`\`
 Basic Test cases
console.log(primeReduction(2,7)); // <--- 0
console.log(primeReduction(2,8)); // <--- 1, of the prime numbers in the range 2, 3, 4, 5, 6, 7, only 7 reduces to one.
console.log(primeReduction(1,25)); // <--- 4
console.log(primeReduction(100, 2000)); // <--- 47

\`\`\``,
              tests:JSON.stringify([
                  {
                    descriptor:"basic_tests",
                    argumentsToPass:[2, 7],
                    expectedResult:'0'
                  },
                  {
                    descriptor:"basic_tests",
                    argumentsToPass:[2, 8],
                    expectedResult:'1'
                  },
                  {
                    descriptor:"basic_tests",
                    argumentsToPass:[1, 25],
                    expectedResult:'4'
                  },
                  {
                    descriptor:"basic_tests",
                    argumentsToPass:[100, 2000],
                    expectedResult:'47'
                  },
              ]),
              skeleton_function:
`function primeReduction(a, b) {

}`,
              solution:
`function primeReduction(a, b) {
  function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return false;
    }
    return true;
  }
  const arr = [];
  // Ensure we have no loops!
  // Return true when we reach 1
  function reduction(n) {
    if (arr.includes(n)) {
      arr.length = 0;
      return false;
    }
    arr.push(n);
    if (n === 1) {
    arr.length = 0;
    return true;
    }
    let hold = 0;
    let num = n;
    // Separate Digits
    while (num > 0) {
      hold += Math.pow(num % 10, 2);
      num -= num % 10;
      num /= 10;
    }
    return reduction(hold);
  }
  let count = 0;
  for (let i = a; i < b; i++) {
    if (isPrime(i)) {
      if (reduction(i)) {
        count++;
      }
    }
  }
  return count;
} `,
              difficulty:80,
              approved:1
            },
            {

              created_by: 1,
              title: "Rotate Image",
                description:`
Given an image represented by an NxN matrix, where each pixel in the image is an integer from 0 - 9,
write a method to rotate the image by 90 degrees counterclockwise. Can you do this in place?


Input
\`\`\`
([ [1, 2],
  [3, 4]]);
\`\`\`

Output
\`\`\`
[ [2, 4],
  [1, 3]].
\`\`\``,
              tests:JSON.stringify([
                  {
                    descriptor:"basic_tests",
                    argumentsToPass:[[[1, 2], [3, 4]]],
                    expectedResult:[[2,4],[1,3]]
                  },
              ]),
              skeleton_function:
`function rotateImage(arr) {
  
}`,
              solution:
`function rotateImage(arr) {
  const len = arr.length;
  for (let i = 0; i < len / 2; i++) {
    for (let j = i; j < len - i - 1; j++) {
      let bucket = arr[i][j];
      arr[i][j] = arr[j][len - i - 1];
      arr[j][len - i - 1] = arr[len - i - 1][len - j - 1];
      arr[len - i - 1][len - j - 1] = arr[len - j - 1][i];
      arr[len - j - 1][i] = bucket;
    }
  }
  return arr;
}`,
              difficulty:80,
              approved:1
            },
{

  created_by: 1,
  title: "Merged Objects",
    description:`
Write a function that given an array of objects will return a single 'merged' object,
where duplicate keys have the last value given.


Input
\`\`\`
[
  {1: '1', 2: '2', 3: '3'}
  {3: '4', 4: '4', 5: '6'}
  {5: '5', 6: '6', 7: '7'}
  ];
\`\`\`

Output
\`\`\`
{1: '1', 2: '2': 3: '4', 4: '4', 5: '5', 6: '6', 7: '7'}
\`\`\``,
  tests:JSON.stringify([
      {
        descriptor:"should_return_an_object",
        argumentsToPass:[[{'key1': 'val1'},{'key2': 'val2'}]],
        expectedResult:{'key1': 'val1', 'key2': 'val2'}
      },
      {
        descriptor:"duplicate_keys_last",
        argumentsToPass:[[{'key1': 'val1'},{'key1': 'val2'}]],
        expectedResult:{'key1': 'val2'}
      },
  ]),
  skeleton_function:
`function mergeObjects(arr) {

}`,
  solution:
`function mergeObjects(objs) {
  newObj = objs[0];
  for (let i = 1; i < objs.length; i++) {
    for (let key in objs[i]) {
      if (!newObj[key] || newObj[key] !== objs[i][key]) {
        newObj[key] = objs[i][key];
      }
    }
  }
  return newObj;
}`,
  difficulty:80,
  approved:1
},
{
  created_by: 1,
  title: "Balanced Brackets",
    description:`
Write a function balancedBrackets that accepts a string and returns true if the parentheses are balanced and false otherwise.


Input Example: 
\`\`\`
balancedBrackets('(');  // false
  balancedBrackets('()'); // true
  balancedBrackets(')(');  // false
  balancedBrackets('(())');  // true
\`\`\``,

  tests:JSON.stringify([
      {
      descriptor:"level_1",
      argumentsToPass:['('],
      expectedResult:false
      },
      {
      descriptor:"level_1",
      argumentsToPass:['()'],
      expectedResult:true
      },
      {
      descriptor:"level_1",
      argumentsToPass:[')('],
      expectedResult:false
      },
      {
      descriptor:"level_1",
      argumentsToPass:['(())'],
      expectedResult:true
      },
      {
      descriptor:"level_2",
      argumentsToPass:['[](){}'],
      expectedResult:true
      },
      {
      descriptor:"level_2",
      argumentsToPass:['[(]{)}'],
      expectedResult:false
      },
      {
      descriptor:"level_2",
      argumentsToPass:['[({})]'],
      expectedResult:true
      },
  ]),
  skeleton_function:
`function balancedBrackets(str) {
  
}`,
  solution:
`function balancedBrackets(str) {
  let line = str.split('');
  const stack = [];
  let ans = true;
  const open = {'(': ')', '{': '}', '[': ']'};
  const close = {')': true, '}': true, ']': true};
  line.forEach((item) => {
    if (open[item]) {
      stack.push(item);
    } else if (close[item]) {
      if (open[stack.pop()] !== item) ans = false;
    }
  });
  return ans && stack.length === 0;
}`,
  difficulty:40,
  approved:1
},
        ]);
      });
  };


