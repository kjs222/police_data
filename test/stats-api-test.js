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

    it('should return one record per month and disp category', (done) => {
      this.request.get('/api/v1/stats/disposition_category_stats', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        var singleRecord = parsed[0]
        var expectedDataPoints = ["id", "neighborhood", "type", "month", "incidents"]
        assert.deepEqual(Object.keys(singleRecord), expectedDataPoints);
        done();
      });
    });

    it('should return data for categories for all months neighborhoods', (done) => {
      this.request.get('/api/v1/stats/disposition_category_stats', (error, response) => {
        if (error) { done(error); }
        var num_records_per_neighborhood = 60;
        var parsed = JSON.parse(response.body);
        assert.equal(parsed.length, num_records_per_neighborhood);
        done();
      });
    });

    it('should return data for default neighborhood if none given', (done) => {
      this.request.get('/api/v1/stats/disposition_category_stats', (error, response) => {
        if (error) { done(error); }
        var defaultNeighborhood = "Gaslamp";
        var singleRecord = JSON.parse(response.body)[0];
        assert.equal(singleRecord["neighborhood"], defaultNeighborhood);
        done();
      });
    });

    it('should return data for user provided neighborhood if one given', (done) => {
      var userNeighborhood = "Talmadge"
      this.request.get('/api/v1/stats/disposition_category_stats?neighborhood=' + userNeighborhood, (error, response) => {
        if (error) { done(error); }
        var singleRecord = JSON.parse(response.body)[0];
        assert.equal(singleRecord["neighborhood"], userNeighborhood);
        done();
      });
    });
  });

});
