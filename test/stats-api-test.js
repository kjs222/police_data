const chai = require('chai');
const assert = chai.assert;
const request = require('request');
const app = require('../app');
const routes = require('../routes/index');


describe('Stats API', () => {

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

  describe('GET /api/v1/stats/overview_stats', () => {

    it('should return an overview by neighborhood', (done) => {
      this.request.get('/api/v1/stats/overview_stats', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        var neighborhoodStats = parsed[0]
        var expectedDataPoints = ["id", "neighborhood", "num_incidents", "num_arrests", "num_mental_health_incidents", "num_transient_incidents"]
        assert.deepEqual(Object.keys(neighborhoodStats), expectedDataPoints);
        done();
      });
    });

    it('should return data for all neighborhoods', (done) => {
      this.request.get('/api/v1/stats/overview_stats', (error, response) => {
        if (error) { done(error); }
        var num_neighborhoods = 125;
        var parsed = JSON.parse(response.body);
        assert.equal(parsed.length, num_neighborhoods);
        done();
      });
    });
  });

  describe('GET /api/v1/stats/disposition_category_stats', () => {

    it('should return an overview by neighborhood', (done) => {
      this.request.get('/api/v1/stats/disposition_category_stats', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        var neighborhoodStats = parsed[0]
        var expectedDataPoints = ["id", "neighborhood", "num_arrests", "num_reports", "num_no_reports", "num_unfounded", "num_other"]
        assert.deepEqual(Object.keys(neighborhoodStats), expectedDataPoints);
        done();
      });
    });

    it('should return data for all neighborhoods', (done) => {
      this.request.get('/api/v1/stats/disposition_category_stats', (error, response) => {
        if (error) { done(error); }
        var num_neighborhoods = 125;
        var parsed = JSON.parse(response.body);
        assert.equal(parsed.length, num_neighborhoods);
        done();
      });
    });
  });

});
