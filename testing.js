/*
    eval() solution

*/
const assert = require('assert');
const solution = eval('(function(hi) { return hi + "hi"; })');
const test = 'strictEqual(solution("hi"),"hihi")';
eval('(' + test.replace(/strictEqual/g, 'assert.strictEqual') + ')');

/*
    Function solution

*/
const assert = require('assert');
const solution = 'function(hi) { return hi + "hi"; }';
const testInput = 'hi';
const testOutput = 'hihi';

function toFunction(str) {
    return Function('"use strict"; return (' + str + ')')();
}

const solutionFunction = toFunction(solution);
assert.strictEqual(solutionFunction(testInput),testOutput,'message if test fails');