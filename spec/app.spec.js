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
  describe('INVALID METHODS', () => {
    it('/api/users / returns status:405 when an invalid route has been used', () => {
      const invalidMethods = ['put', 'delete'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api/users')
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('method not allowed');
          });
      });
      return Promise.all(methodPromises);
    });
    it('/api/topics / returns  status:405 when an invalid route has been used', () => {
      const invalidMethods = ['put', 'delete'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api/topics')
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('method not allowed');
          });
      });
      return Promise.all(methodPromises);
    });
    it('/api/articles/ returns  status:405 when an invalid route has been used', () => {
      const invalidMethods = ['delete', 'put'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api/articles')
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('method not allowed');
          });
      });
      return Promise.all(methodPromises);
    });
    it('/api/comments/ returns  status:405 when an invalid route has been used', () => {
      const invalidMethods = ['put'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api/comments')
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('method not allowed');
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe('/api/topics', () => {
    it('GET 200/ returns the list of topics object with all the relevant keys', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          expect(body.topics.length).to.equal(3);
          expect(body.topics[0]).to.contain.keys('slug', 'description');
        });
    });
  });
  describe('/api/users', () => {
    it('GET404 / returns "username not found" when passed a username which does not exist', () => {
      return request(app)
        .get('/api/users/megatron')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('username not found');
        });
    });
    it('GET200 / return a single user with all its keys to the client', () => {
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
    it(`GET 400  / "bad request" when the client uses incorrect syntax`, () => {
      return request(app)
        .get('/api/articles/harrythehatche-t')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('22P02 database error');
        });
    });
    it('GET 400 / when the order is neither ascending or descending', () => {
      return request(app)
        .get('/api/articles?order=wrong')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal(
            "Order must must be either 'asc' or 'desc'."
          );
        });
    });
    it('GET 404 / when trying to fetch an article that does not exist', () => {
      return request(app)
        .get('/api/articles/157232')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal(
            'article_id: 157232 is not in the database'
          );
        });
    });
    it('GET 200 / returns an array of all the articles available in the database', () => {
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
    it('GET 200 / returns an array of all the articles in default order (descending)', () => {
      return request(app)
        .get('/api/articles?order=desc')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy('created_at', {
            descending: true
          });
        });
    });
    it('GET 200 / responds with all the articles for the user specified by the client', () => {
      return request(app)
        .get('/api/articles?author=butter_bridge')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].author).to.equal('butter_bridge');
          expect(body.articles[1].author).to.equal('butter_bridge');
        });
    });
    it('GET 404 / returns an error if there are not specified articles by the specific author', () => {
      return request(app)
        .get('/api/articles?author=benjoBanjo')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('No articles by: benjoBanjo');
        });
    });

    it('GET 404 / returns an error if there are no topic in database specified by the client query', () => {
      return request(app)
        .get('/api/articles?topic=donotvaccinateyourkids')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal(
            'No articles for topic: donotvaccinateyourkids'
          );
        });
    });
  });
  describe('/api/articles/:article_id', () => {
    it('GET 200 / returns an article specifed by the client with all the relevant keys', () => {
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
    it('PATCH 201 / adds an "inc_votes:newVote" property to relevant article id', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 7 })
        .expect(201)
        .then(({ body }) => {
          expect(body.article[0].votes).to.equal(107);
        });
    });
    it(`GET 400 / when the body does not contain inc_votes property on the body `, () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ ines: 100 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal(
            'The request does not contain property: inc_votes in its body'
          );
        });
    });
    it(`GET 400 / when the body contins more properties on the body than just inc_votes `, () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 100, yo: 200 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal(
            'The request body must have exactly one property: inc_votes. Check your request body'
          );
        });
    });
    it(`GET 400 / when the inc_values property on the body is not an integer `, () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 'I am a string' })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal(
            'inc_votes is not a number. Check the body of your request'
          );
        });
    });
  });
  describe('/api/articles/:article_id/comments', () => {
    it('POST 201 / adds a comment property to the relevant article_id', () => {
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
    it('POST 400 when the client sends an empty object as a comment', () => {
      return request(app)
        .post('/api/articles/1/comments')
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('23502 database error');
        });
    });
    it('GET 200 / responds with an array of comments for the given article_id of which each comment has the following properties', () => {
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
    it('GET 200 / responds with an array of comments with default sort order (by created_at and desc)', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.descendingBy('created_at');
        });
    });
    it('GET 200 / responds with an array of comments sorted by author desc rather than default (created_at, desc)', () => {
      return request(app)
        .get('/api/articles/1/comments?sortBy=author')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.descendingBy('author', {
            descending: true
          });
        });
    });
    it('GET 200 / responds with an array of comments sorted by votes rather than by default order and it is sorted ascending', () => {
      return request(app)
        .get('/api/articles/1/comments?sortBy=author')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.descendingBy('author', {
            descending: false
          });
        });
    });
    it('GET 400 / when the order is neither ascending or descending', () => {
      return request(app)
        .get('/api/articles/1/comments?order=booyah')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal(
            "Order must must be either 'asc' or 'desc'."
          );
        });
    });
  });
  describe('/api/comments/:comment_id', () => {
    it('PATCH 201 / updates an "inc_votes:newVote" property to relevant comment id', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: 100 })
        .expect(201)
        .then(({ body }) => {
          expect(body.comment[0].votes).to.equal(116);
        });
    });
    it('GET 404 / returns an error message if the comment is not in the database ', () => {
      return request(app)
        .patch('/api/comments/113256')
        .send({ inc_votes: 100 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('comment: 113256 does not exist');
        });
    });
    it(`GET 400 / when the body does not contain inc_votes property on the body `, () => {
      return request(app)
        .patch('/api/comments/1')
        .send({ ines: 100 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal(
            'The request does not contain property: inc_votes in its body'
          );
        });
    });
    it(`GET 400 / when the body contins more properties on the body than just inc_votes `, () => {
      return request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: 100, yo: 200 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal(
            'The request body must have exactly one property: inc_votes. Check your request body'
          );
        });
    });
    it(`GET 400 / when the inc_values property on the body is not an integer `, () => {
      return request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: 'I am a string' })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal(
            'inc_votes is not a number. Check the body of your request'
          );
        });
    });
    it('DELETE / 204 deletes a specific comment by ID ', () => {
      return request(app)
        .delete('/api/comments/1')
        .expect(204);
    });
  });
});
