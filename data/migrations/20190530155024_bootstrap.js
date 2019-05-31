exports.up = function (knex, Promise) {
    return knex.schema.createTable('users', tbl => {
        tbl.increments();

        tbl.string('created_at')
            .defaultTo(knex.fn.now());
            
        tbl.string('name')
            .notNullable();
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists('users');
};