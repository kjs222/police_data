const chai = require('chai');
const assert = chai.assert;
const request = require('request');
const app = require('../app');
const routes = require('../routes/index');


describe('Disposition API', () => {

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

  describe('GET /api/v1/dispositions', () => {
    it('should return an array of dispositions', (done) => {
      this.request.get('/api/v1/dispositions', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        assert.isArray(parsed);
        done();
      });
    });

    it('should return 42 dispositions', (done) => {
      var numDispositions = 42;
      this.request.get('/api/v1/dispositions', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body);
        assert.equal(parsed.length, numDispositions);
        done();
      });
    });

    it('should return dispositions with correct keys', (done) => {
      this.request.get('/api/v1/dispositions', (error, response) => {
        if (error) { done(error); }
        var parsedDisposition = JSON.parse(response.body)[0];
        var keys = Object.keys(parsedDisposition);
        assert.isObject(parsedDisposition);
        assert.equal(keys.length, 2);
        assert.include(keys, "code");
        assert.include(keys, "description");
        done();
      });
    });

  });

});
