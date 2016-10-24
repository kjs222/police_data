const chai = require('chai');
const assert = chai.assert;
const request = require('request');
const app = require('../app');
const routes = require('../routes/index');


describe('CallType API', () => {

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

  describe('GET /api/v1/call_types', () => {
    it('should return an array of call_types', (done) => {
      this.request.get('/api/v1/call_types', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        assert.isArray(parsed);
        done();
      });
    });

    it('should return 311 call_types', (done) => {
      this.request.get('/api/v1/call_types', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        assert.equal(parsed.length, 311);
        done();
      });
    });

    it('should return call_types with correct keys', (done) => {
      this.request.get('/api/v1/call_types', (error, response) => {
        if (error) { done(error); }
        var parsedCallType = JSON.parse(response.body)[0]
        var keys = Object.keys(parsedCallType)
        assert.isObject(parsedCallType);
        assert.equal(keys.length, 3);
        assert.include(keys, "code");
        assert.include(keys, "description");
        done();
      });
    });

  });

});
