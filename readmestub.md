Newsworthy News

This repository is for an API I built, that hosts a small database of news articles. It also store info for the database users can leave comments for any articles.

Installation (same for Mac and Linux users apart from point 5)

1. Clone the repo to a directory of your choosing using:
   git clone https://github.com/Reghol/Newsworthy-News.git

2. CD into the directory and launch in your chosen code editor.

3. Install the dependencies that are required for this API by using the following command:

   npm install

4. Seed your database (all scripts and dependencies can be found in package.json):

   npm run setup-db
   npm run seed

5) Mac installation. For Linux Go to Point 6

   Create your knexfile (the database has been built using knex query builder). Put this file in the root directory of the app and paste the below code into it:

```
   const { DB_URL } = process.env;
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
   }
   },
   test: {
   connection: {
   database: 'nc_news_test',
   }
   },
   production: {
   connection: `${DB_URL}?ssl=true`
   }
   };

   module.exports = { ...customConfig[ENV], ...baseConfig };
```

6. Create your knexfile (the database has been built using knex query builder). Put this file in the root directory of the app and paste the below code into it:

```
   const { DB_URL } = process.env;
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
   user: 'your usernamehere',
   password: 'your password here'

   }
   },

   test: {
   connection: {
   database: 'nc_news_test',

   user: 'your usernamehere',
   password: 'your password here'

   }
   },
   production: {
   connection: `${DB_URL}?ssl=true`
   }
   };

   module.exports = { ...customConfig[ENV], ...baseConfig };
```

7. Testing. There are 2 test files. One for the utility functions, another one for the app itself. The tests itself have been written using Mocha testing framework and Chai assertion library.

   npm test

Requirements
Node: version 10 and ,higher
Postgres: version 10.10
