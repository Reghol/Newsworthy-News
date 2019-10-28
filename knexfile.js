const ENV = process.env.NODE_ENV || 'development';

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};

const customConfig = {
  development: {
    connection: {
      database: 'nc_news',
      user: 'sonofhonor',
      password: 'psqlsr3ql'
    }
  },
  test: {
    connection: {
      database: 'nc_news_test',
      user: 'sonofhonor',
      password: 'psqlsr3ql'
    }
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
