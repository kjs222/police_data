const chai = require('chai');
const assert = chai.assert;
const request = require('request');
const app = require('../app');
const routes = require('../routes/index');


describe('Incident API', () => {

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

  describe('GET /api/v1/incidents', () => {
    it('should return an array of incidents', (done) => {
      this.request.get('/api/v1/incidents', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        assert.isArray(parsed);
        done();
      });
    });

    it('should return 100 incidents', (done) => {
      var numIncidentsPerPage = 100;
      this.request.get('/api/v1/incidents', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        assert.equal(parsed.length, numIncidentsPerPage);
        done();
      });
    });

    it('should return incidents with correct keys', (done) => {
      this.request.get('/api/v1/incidents', (error, response) => {
        if (error) { done(error); }
        var parsedIncident = JSON.parse(response.body)[0];
        var keys = Object.keys(parsedIncident);
        assert.isObject(parsedIncident);
        assert.equal(keys.length, 10);
        assert.equal(keys.indexOf("incident number"), 0);
        assert.equal(keys.indexOf("date"), 1);
        assert.equal(keys.indexOf("address"), 2);
        assert.equal(keys.indexOf("priority"), 3);
        assert.equal(keys.indexOf("beat"), 4);
        assert.equal(keys.indexOf("neighborhood"), 5);
        assert.equal(keys.indexOf("disposition code"), 6);
        assert.equal(keys.indexOf("disposition description"), 7);
        assert.equal(keys.indexOf("call type code"), 8);
        assert.equal(keys.indexOf("call type description"), 9);
        done();
      });
    });

  });

});
