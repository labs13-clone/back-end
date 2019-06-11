exports.up = function (knex, Promise) {
    return knex.schema.createTable('users', tbl => {
            tbl.increments();

            tbl.datetime('created_at')
                .defaultTo(knex.fn.now());

            tbl.string('sub_id')
                .unique()
                .notNullable();
        })
        .createTable('categories', tbl => {
            tbl.increments();

            tbl.datetime('created_at')
                .defaultTo(knex.fn.now());

            tbl.string('name')
                .unique()
                .notNullable();
        })
        .createTable('challenges', tbl => {
            tbl.increments();

            tbl.datetime('created_at')
                .defaultTo(knex.fn.now());

            tbl.integer('created_by')
                .notNullable()
                .references('id')
                .inTable('users')
                .onDelete('RESTRICT')
                .onUpdate('CASCADE');

            tbl.string('title',100)
                .unique()
                .notNullable();

            tbl.string('description',5000)
                .notNullable();

            tbl.string('tests',5000)
                .notNullable();

            tbl.string('skeleton_function',5000)
                .notNullable();

            tbl.string('solution',5000)
                .notNullable();

            tbl.integer('difficulty')
                .unsigned()
                .notNullable()
                .defaultTo(1);

            tbl.boolean('approved')
                .defaultTo(0);
        })
        .createTable('challenges_categories', tbl => {
            tbl.increments();

            tbl.integer('challenge_id')
                .notNullable()
                .references('id')
                .inTable('challenges')
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

            tbl.datetime('created_at')
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
                .notNullable()
                .defaultTo(1);

            tbl.boolean('completed')
                .defaultTo(0);

            tbl.string('solution');
        })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists('user_submissions')
        .dropTableIfExists('challenges_categories')
        .dropTableIfExists('challenges')
        .dropTableIfExists('categories')
        .dropTableIfExists('users');
};