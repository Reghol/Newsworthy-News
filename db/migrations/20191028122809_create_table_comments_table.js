exports.up = function(knex) {
  return knex.schema.createTable('comments', commentTable => {
    commentTable.increments('comment_id').primary();
    commentTable.string('author').references('users.username');
    commentTable
      .integer('article_id')
      .references('articles.article_id')
      .notNullable()
      .onDelete('CASCADE');
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
  return knex.schema.dropTable('comments');
};
