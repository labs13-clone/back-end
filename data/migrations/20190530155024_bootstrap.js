exports.up = function (knex, Promise) {
    return knex.schema.createTable('users', tbl => {
            tbl.increments();

            tbl.string('created_at')
                .defaultTo(knex.fn.now());

            tbl.string('role')
                .notNullable();

            tbl.string('sub_id')
                .unique()
                .notNullable();
        })
        .createTable('categories', tbl => {
            tbl.increments();

            tbl.string('created_at')
                .defaultTo(knex.fn.now());

            tbl.string('name')
                .unique()
                .notNullable();
        })
        .createTable('challenges', tbl => {
            tbl.increments();

            tbl.string('created_at')
                .defaultTo(knex.fn.now());

            tbl.integer('created_by')
                .notNullable()
                .references('id')
                .inTable('users')
                .onDelete('RESTRICT')
                .onUpdate('CASCADE');

            tbl.string('title')
                .unique()
                .notNullable();

            tbl.string('description')
                .notNullable();

            tbl.json('tests')
                .notNullable();

            tbl.json('skeleton_function')
                .notNullable();

            tbl.json('solution')
                .notNullable();

            tbl.string('difficulty')
                .notNullable();

            tbl.boolean('approved')
                .defaultTo(0);
        })
        .createTable('challenges_categories', tbl => {
            tbl.increments();

            tbl.integer('challenge_id')
                .notNullable()
                .references('id')
                .inTable('users')
                .onDelete('RESTRICT')
                .onUpdate('CASCADE');

            tbl.integer('categories_id')
                .notNullable()
                .references('id')
                .inTable('categories')
                .onDelete('RESTRICT')
                .onUpdate('CASCADE');
        })
        .createTable('user_submissions', tbl => {
            tbl.increments();

            tbl.string('created_at')
                .defaultTo(knex.fn.now());

            tbl.integer('created_by')
                .notNullable()
                .references('id')
                .inTable('users')
                .onDelete('RESTRICT')
                .onUpdate('CASCADE');

            tbl.integer('challenge_id')
                .notNullable()
                .references('id')
                .inTable('challenges')
                .onDelete('RESTRICT')
                .onUpdate('CASCADE');

            tbl.integer('attempts')
                .notNullable();

            tbl.boolean('completed')
                .defaultTo(0);

            tbl.boolean('started')
                .defaultTo(0);

            tbl.json('solution')
                .notNullable();
        })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists('user_submissions')
        .dropTableIfExists('challenges_categories')
        .dropTableIfExists('challenges')
        .dropTableIfExists('categories')
        .dropTableIfExists('users');
};