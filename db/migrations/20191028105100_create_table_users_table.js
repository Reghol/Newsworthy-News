exports.up = function(knex) {
  console.log('creating users_table');
  return knex.schema.createTable('users', usersTable => {
    usersTable.string('username').primary();
    usersTable.string('avatar_url').notNullable();
    usersTable.string('name').notNullable();
  });
};

exports.down = function(knex) {
  console.log('removing users_table');
  return knex.schema.dropTable('users');
};
