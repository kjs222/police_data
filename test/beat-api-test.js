const chai = require('chai');
const assert = chai.assert;
const request = require('request');
const app = require('../app');
const routes = require('../routes/index');


describe('Beat API', () => {

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

  describe('GET /api/v1/beats', () => {
    it('should return an array of beats', (done) => {
      this.request.get('/api/v1/beats', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        assert.isArray(parsed);
        done();
      });
    });

    it('should return 136 beats', (done) => {
      var numBeats = 136;
      this.request.get('/api/v1/beats', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        assert.equal(parsed.length, numBeats);
        done();
      });
    });

    it('should return beats with correct keys', (done) => {
      this.request.get('/api/v1/beats', (error, response) => {
        if (error) { done(error); }
        var parsedBeat = JSON.parse(response.body)[0]
        var keys = Object.keys(parsedBeat)
        assert.isObject(parsedBeat);
        assert.equal(keys.length, 3);
        assert.include(keys, "neighborhood");
        assert.include(keys, "number");
        done();
      });
    });

  });

});
