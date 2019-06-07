
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('categories').del()
    .then(function () {
      // Inserts seed entries
      return knex('categories').insert([
        {name: 'Strings'},
        {name: 'Fundamentals'},
        {name: 'Alogrithms'},
        {name: 'Data Types'},
        {name: 'Logic'},
        {name: 'Numbers'},
        {name: 'Mathematics'},
        {name: 'Arrays'},
        {name: 'Basic Language Features'},
        {name: 'Puzzles'},
        {name: 'Games'},
        {name: 'Programming Paradigms'},
        {name: 'Data Structures'},
        {name: 'Control Flow'},
        {name: 'Declarative Programming'},
        {name: 'Advanced Language Features'},
        {name: 'Regular Expressions'},
        {name: 'Lists'},
        {name: 'Loops'},
        {name: 'Data'},
        {name: 'Arithmetic'},
        {name: 'Functions'},
        {name: 'Object-oriented Programming'},
        {name: 'Algebra'},
        {name: 'Databases'},
        {name: 'Information Systems'},
        {name: 'SQL'},
        {name: 'Optimization'},
        {name: 'Performance'},
        {name: 'Sorting'},
        {name: 'Security'},
        {name: 'Geometry'},
        {name: 'Parsing'},
        {name: 'Computer Science'},
        {name: 'Bugs'},
        {name: 'Binary'},
        {name: 'Cryptography'},
        {name: 'Recursion'},
        {name: 'Sequences'},
        {name: 'Classes'},
        {name: 'Integers'},
        {name: 'Functional Programming'},
        {name: 'Objects'},
        {name: 'Graphs'},
        {name: 'Dates/Time'},
        {name: 'Utilities'},
        {name: 'Design Patterns'},
        {name: 'Conditional Statements'},
        {name: 'Design Principles'}
      ]);
    });
};
