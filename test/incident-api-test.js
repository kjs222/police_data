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

    it('should return count of total incidents', (done) => {
      this.request.get('/api/v1/incidents', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        assert.isNotNaN(parseInt(parsed.total_incidents));
        done();
      });
    });

    it('should return an array of incidents', (done) => {
      this.request.get('/api/v1/incidents', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        assert.isArray(parsed.incidents);
        done();
      });
    });

    it('should return 100 incidents', (done) => {
      var numIncidentsPerPage = 100;
      this.request.get('/api/v1/incidents', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        assert.equal(parsed.incidents.length, numIncidentsPerPage);
        done();
      });
    });

    it('should return incidents with correct keys', (done) => {
      this.request.get('/api/v1/incidents', (error, response) => {
        if (error) { done(error); }
        var parsedJson = JSON.parse(response.body);
        var keys = Object.keys(parsedJson.incidents[0]);
        assert.isObject(parsedJson);
        assert.equal(keys.length, 11);
        assert.equal(keys.indexOf("incident number"), 0);
        assert.equal(keys.indexOf("date"), 1);
        assert.equal(keys.indexOf("address"), 2);
        assert.equal(keys.indexOf("priority"), 3);
        assert.equal(keys.indexOf("beat"), 4);
        assert.equal(keys.indexOf("neighborhood"), 5);
        assert.equal(keys.indexOf("disposition code"), 6);
        assert.equal(keys.indexOf("disposition type"), 7);
        assert.equal(keys.indexOf("disposition description"), 8);
        assert.equal(keys.indexOf("call type code"), 9);
        assert.equal(keys.indexOf("call type description"), 10);
        done();
      });
    });

    it('should paginate results', (done) => {
      var page = 2;
      var numIncidentsPerPage = 100;
      this.request.get('/api/v1/incidents?page=' + page, (error, response) => {
        if (error) { done(error); }
        var parsedJson = JSON.parse(response.body);
        assert.equal(parsedJson.incidents.length, numIncidentsPerPage);
        done();
      });
    });

    xit('should paginate results and return different incidents', (done) => {
      var page = 2;

      this.request.get('/api/v1/incidents', (error, response) => {
        var pageOneResults = JSON.parse(response.body).incidents;
        //pageOneResults is not getting passed in to callback on second ajax calll
        this.request.get('/api/v1/incidents?page=' + page, (error, response, pageOneResults) => {
          var pageTwoResults = JSON.parse(response.body).incidents;
          console.log("page1", pageOneResults[0]);
          console.log("page2", pageTwoResults[0]);
          assert.notEqual(pageOneResults, pageTwoResults)
          done();
        });
      });
    });

  });

});
