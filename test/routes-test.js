const chai = require('chai');
const assert = chai.assert;
const request = require('request');
const app = require('../app');
const routes = require('../routes/index');


describe('Routes', () => {

  before((done) => {
    this.port = 9876;

    this.server = app.listen(this.port, (err, result) => {
      if (err) { return done(err); }
      done();
    });

    this.request = request.defaults({
      baseUrl: 'http://localhost:9876/'
    });
  });

  after(() => {
    this.server.close();
  });

  it('should exist', () => {
    assert(routes);
  });

  describe('GET /', () => {
    it('should return a 200', (done) => {
      this.request.get('/', (error, response) => {
        if (error) { done(error); }
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });

  describe('GET /api/v1/incidents', () => {
    it('should return a 200', (done) => {
      this.request.get('/api/v1/incidents', (error, response) => {
        if (error) { done(error); }
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });

  describe('GET /api/v1/call_types', () => {
    it('should return a 200', (done) => {
      this.request.get('/api/v1/call_types', (error, response) => {
        if (error) { done(error); }
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });


  describe('GET /api/v1/dispositions', () => {
    it('should return a 200', (done) => {
      this.request.get('/api/v1/dispositions', (error, response) => {
        if (error) { done(error); }
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });

  describe('GET /api/v1/beats', () => {
    it('should return a 200', (done) => {
      this.request.get('/api/v1/beats', (error, response) => {
        if (error) { done(error); }
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });

  describe('GET /api/v1/stats/overview_stats', () => {
    it('should return a 200', (done) => {
      this.request.get('/api/v1/stats/overview_stats', (error, response) => {
        if (error) { done(error); }
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });

  describe('GET /api/v1/stats/disposition_category_stats', () => {
    it('should return a 200', (done) => {
      this.request.get('/api/v1/stats/disposition_category_stats', (error, response) => {
        if (error) { done(error); }
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });

});
