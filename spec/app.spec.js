process.env.NODE_ENV = 'test';

const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../app/app');
const knex = require('../connection');
const testData = require('../db/data');
chai.use(require('sams-chai-sorted'));

describe('APP TESTING - ENDPOINTS AND ERROR HANDLING', () => {
  beforeEach(() => {
    return knex.seed.run();
  });
  after(() => {
    return knex.destroy();
  });
  it('INVALID PATHS - server responds with 404 if an invalid path is used by the client', () => {
    const invalidPathOne = request(app)
      .get('/leInvalideroute')
      .expect(404)
      .then(({ body }) => {
        expect(body).to.have.key('err');
        expect(body.err).to.equal("Ain't such route round these parts partner");
      });
    const invalidPathTwo = request(app)
      .put('/api/sdhjfgsjfg')
      .expect(404)
      .then(({ body }) => {
        expect(body).to.have.key('err');
        expect(body.err).to.equal("Ain't such route round these parts partner");
      });
    return Promise.all([invalidPathOne, invalidPathTwo]);
  });
  describe('/api/topics', () => {
    it('/api/topics GET 200/ returns the list of topics object with all the relevant keys', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          expect(body.topics.length).to.equal(3);
          expect(body.topics[0]).to.contain.keys('slug', 'description');
        });
    });
    it('/api/topics GET 400 error', () => {});
  });
  describe('/api/users', () => {
    it('/api/users/:user GET404 / returns "username not found" when passed a username which does not exist', () => {
      return request(app)
        .get('/api/users/megatron')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('username not found');
        });
    });
    it('/api/users/:user GET200 / return a single user with all its keys to the client', () => {
      return request(app)
        .get('/api/users/butter_bridge')
        .expect(200)
        .then(({ body }) => {
          expect(body.user[0]).to.eql({
            username: 'butter_bridge',
            name: 'jonny',
            avatar_url:
              'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
          });
        });
    });
  });
  describe('/api/articles', () => {
    it(`returns 400: "bad request" when the client uses incorrect syntax`, () => {
      return request(app)
        .get('/api/articles/harrythehatche-t')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('22P02 database error');
        });
    });
    it('returns 404 when trying to fetch an article that does not exist', () => {
      return request(app)
        .get('/api/articles/157232')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal(
            'article_id: 157232 is not in the database'
          );
        });
    });
    it('/api/articles GET 200 / returns an array of all the articles available in the database', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0]).to.contain.keys(
            'author',
            'title',
            'article_id',
            'topic',
            'created_at',
            'votes',
            'comment_count'
          );
        });
    });
    it('/api/articles?order=desc GET 200 / returns an array of all the articles in default order (descending)', () => {
      return request(app)
        .get('/api/articles?order=desc')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy('created_at', {
            descending: true
          });
        });
    });
    it('/api/articles?author=butter_bridge GET 200 / responds with all the articles for the user specified by the client', () => {
      return request(app)
        .get('/api/articles?author=butter_bridge')
        .expect(200)
        .then(({ body }) => {
          // console.log(body);
          expect(body.articles[0].author).to.equal('butter_bridge');
          expect(body.articles[1].author).to.equal('butter_bridge');
        });
    });
    it('/api/articles?author=benjoBanjo GET 404 / returns an error if there are not specified articles by the specific author', () => {
      return request(app)
        .get('/api/articles?author=benjoBanjo')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('No articles by: benjoBanjo');
        });
    });
    it('/api/articles?author=benjoBanjo GET 404 / returns an error if there are no topic in database specified by the client query', () => {
      return request(app)
        .get('/api/articles?topic=donotvaccinateyourkids')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal(
            'No articles for topic: donotvaccinateyourkids'
          );
        });
    });
    it('/api/articles/:article_id GET 200 / returns an article specifed by the client with all the relevant keys', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
          expect(body.article.length).to.equal(1);
          expect(body.article[0]).to.contain.keys(
            'title',
            'topic',
            'author',
            'body',
            'created_at',
            'votes'
          );
        });
    });
    it('/api/articles/:article_id PATCH 201 / adds an "inc_votes:newVote" property to relevant article id', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 7 })
        .expect(201)
        .then(({ body }) => {
          expect(body.article[0].votes).to.equal(107);
        });
    });
  });
  describe('/api/articles/:article_id/comments', () => {
    it('/articles/:article_id/comments POST 201 / adds a comment property to the relevant article_id', () => {
      return request(app)
        .post('/api/articles/1/comments')
        .send({ username: 'butter_bridge', body: 'butterlicious' })
        .expect(201)
        .then(({ body }) => {
          expect(body.comment[0]).to.have.keys(
            'comment_id',
            'author',
            'article_id',
            'votes',
            'created_at',
            'body'
          );
        });
    });
    it('/api/articles/:article_id/comments POST 400 when the client sends an empty object as a comment', () => {
      return request(app)
        .post('/api/articles/1/comments')
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('23502 database error');
        });
    });
    it('/api/articles/:article_id/comments GET 200 / responds with an array of comments for the given article_id of which each comment has the following properties', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments[0]).to.have.keys(
            'comment_id',
            'author',
            'article_id',
            'votes',
            'created_at',
            'body'
          );
        });
    });
    it('/api/articles/:article_id/comments GET 200 / responds with an array of comments with default sort order (by created_at and desc)', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.descendingBy('created_at');
        });
    });
    it('/api/articles/:article_id/comments?sortBy=author GET 200 / responds with an array of commetns sorted by author desc rather than default (created_at, desc)', () => {
      return request(app)
        .get('/api/articles/1/comments?sortBy=author')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.descendingBy('author', {
            descending: true
          });
        });
    });
    it('/api/articles/:article_id/comments?sortBy=author GET 200 / responds with an array of commetns sorted by votes rather than by default order and it is sorted ascending', () => {
      return request(app)
        .get('/api/articles/1/comments?sortBy=author')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.descendingBy('author', {
            descending: false
          });
        });
    });
  });
  describe('/api/comments/', () => {
    it('/api/comments/:comment_id DELETE / 204 deletes a specific comment by ID ', () => {
      return request(app)
        .delete('/api/comments/1')
        .expect(204);
    });
  });
});
