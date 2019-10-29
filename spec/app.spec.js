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
          expect(body.msg).to.equal('No such resource exists');
        });
    });
    it('/articles/: article_id returns an article specifed by the client with all the relevant keys', () => {
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
    it('/articles/:article_id PATCH adds an "inc_votes:newVote" property to relevant article id', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 7 })
        .expect(201)
        .then(({ body }) => {
          console.log(body, 'i am in the body');
          expect(body.article[0].votes).to.equal(107);
        });
    });
  });
  describe.only('/api/articles/:article_id/comments', () => {
    it('/articles/:article_id/comments POST adds a comment property to the relevant article_id', () => {
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
  });
});
