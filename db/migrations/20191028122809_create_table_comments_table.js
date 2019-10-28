exports.up = function(knex) {
  // console.log('creating comments table');
  return knex.schema.createTable('comments', commentTable => {
    commentTable.increments('comment_id').primary();
    commentTable.string('author').references('users.username');
    commentTable
      .integer('article_id')
      .references('articles.article_id')
      .notNullable();
    commentTable
      .integer('votes')
      .defaultTo(0)
      .notNullable();
    commentTable
      .date('created_at')
      .defaultTo(knex.fn.now())
      .notNullable();

    commentTable.text('body').notNullable();
  });
};

exports.down = function(knex) {
  // console.log('removing comments table');
  return knex.schema.dropTable('comments');
};
