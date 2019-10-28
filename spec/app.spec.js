process.env.NODE_ENV = 'test';

const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../app/app');
const knex = require('../connection');
const testData = require('../db/data');
chai.use(require('sams-chai-sorted'));

describe('APP TESTING - ENDPOINTS AND ERRORS', () => {
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
  describe('/', () => {
    it('/api/topics GET 200/ returns the list of topics object with all the relevant keys', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          expect(body.topics.length).to.equal(3);
          expect(body.topics[0]).to.contain.keys('slug', 'description');
        });
    });
  });
});

// describe('/', () => {
//   beforeEach(() => knex.seed.run());
//   after(() => knex.destroy());
//   it('ALL /invalid_paths - responds 404 with an object with key err containing an error message for invalid paths', () => {
//
//     const req3 = request(app)
//       .delete('/api/articles/3/sdfhjkgsdfk')
//       .expect(404)
//       .then(({ body }) => {
//         expect(body).to.have.key('err');
//         expect(body.err).to.equal('File or path not found');
//       });
//     return Promise.all([req1, req2, req3]);
//   });
//   it('ALL /validpath with invalid method - responds 405 when trying to use invalid methods on valid paths', () => {
//     const req1 = request(app)
//       .put('/api/topics')
//       .expect(405);
//     const req2 = request(app)
//       .patch('/api/users/rogersob')
//       .expect(405);
//     const req3 = request(app)
//       .delete('/api')
//       .expect(405);
//     return Promise.all([req1, req2, req3]);
//   });
