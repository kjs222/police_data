const chai = require('chai');
const assert = chai.assert;
const request = require('request');
const app = require('../app');
const routes = require('../routes/index');


describe('Incident Search API', () => {

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

  describe('GET /api/v1/incidents with search params', () => {

    it('should search by incident number', (done) => {
      this.request.get('/api/v1/incidents?number=P16070041611', (error, response) => {
        if (error) { done(error); }
        var parsedIncident = JSON.parse(response.body)[0]
        assert.equal(parsedIncident["incident number"], 'P16070041611');
        assert.equal(parsedIncident["neighborhood"], 'Pacific Beach');
        done();
      });
    });

    it('should search by priority', (done) => {
      this.request.get('/api/v1/incidents?priority=3', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body);
        var parsedIncident = parsed[0];
        assert.isAtLeast(parsed.length, 100);
        assert.equal(parsedIncident["priority"], '3');
        done();
      });
    });

    it('should search by beat', (done) => {
      this.request.get('/api/v1/incidents?beat=122', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        var parsedIncident = parsed[0]
        assert.isAtLeast(parsed.length, 100);
        assert.equal(parsedIncident["beat"], '122');
        assert.equal(parsedIncident["neighborhood"], 'Pacific Beach');
        done();
      });
    });

    it('should search by neighborhood', (done) => {
      this.request.get('/api/v1/incidents?neighborhood=Pacific Beach', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        var parsedIncident = parsed[0]
        assert.isAtLeast(parsed.length, 100);
        assert.equal(parsedIncident["beat"], '122');
        assert.equal(parsedIncident["neighborhood"], 'Pacific Beach');
        done();
      });
    });

    it('should search by disposition code', (done) => {
      this.request.get('/api/v1/incidents?disp_code=K', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        var parsedIncident = parsed[0]
        assert.isAtLeast(parsed.length, 100);
        assert.equal(parsedIncident["disposition code"], 'K');
        done();
      });
    });

    it('should search by disposition description', (done) => {
      this.request.get('/api/v1/incidents?disp_desc=NO REPORT REQUIRED', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        var parsedIncident = parsed[0]
        assert.isAtLeast(parsed.length, 100);
        assert.equal(parsedIncident["disposition code"], 'K');
        assert.equal(parsedIncident["disposition description"], 'NO REPORT REQUIRED');
        done();
      });
    });

    it('should search by call code', (done) => {
      this.request.get('/api/v1/incidents?call_code=CW', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        var parsedIncident = parsed[0]
        assert.isAtLeast(parsed.length, 100);
        assert.equal(parsedIncident["call type code"], 'CW');
        assert.equal(parsedIncident["call type description"], 'CHECK THE WELFARE');
        done();
      });
    });

    it('should search by call type description', (done) => {
      this.request.get('/api/v1/incidents?call_desc=CHECK THE WELFARE', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        var parsedIncident = parsed[0]
        assert.isAtLeast(parsed.length, 100);
        assert.equal(parsedIncident["call type code"], 'CW');
        assert.equal(parsedIncident["call type description"], 'CHECK THE WELFARE');
        done();
      });
    });

    it('should search by street', (done) => {
      this.request.get('/api/v1/incidents?street=El Cajon', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        var parsedIncident = parsed[0]
        assert.notEqual(parsedIncident["address"].indexOf("EL CAJON"), -1);
        done();
      });
    });

    it('should search by number', (done) => {
      this.request.get('/api/v1/incidents?street_number=4100', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        var parsedIncident = parsed[0]
        assert.notEqual(parsedIncident["address"].indexOf("4100"), -1);
        done();
      });
    });

    it('should search by date', (done) => {
      this.request.get('/api/v1/incidents?date=2015-04-17', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        var firstParsedIncident = parsed[0]
        var lastParsedIncident = parsed[parsed.length - 1]
        assert.notEqual(firstParsedIncident["date"].indexOf("2015-04-17"), -1);
        assert.notEqual(lastParsedIncident["date"].indexOf("2015-04-17"), -1);
        done();
      });
    });


    it('should search by date range', (done) => {
      this.request.get('/api/v1/incidents?start_date=2015-04-17&end_date=2015-04-18', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        var firstParsedIncident = parsed[0]
        var lastParsedIncident = parsed[parsed.length - 1]
        assert.equal(firstParsedIncident["date"].indexOf("2015-04-16"), -1);
        assert.equal(lastParsedIncident["date"].indexOf("2015-04-16"), -1);
        assert.equal(firstParsedIncident["date"].indexOf("2015-04-19"), -1);
        assert.equal(lastParsedIncident["date"].indexOf("2015-04-19"), -1);
        done();
      });
    });

    it('should search multiple params', (done) => {
      this.request.get('/api/v1/incidents?date=2015-04-17&call_code=CW', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        var firstParsedIncident = parsed[0]
        var lastParsedIncident = parsed[parsed.length - 1]
        assert.notEqual(firstParsedIncident["date"].indexOf("2015-04-17"), -1);
        assert.equal(firstParsedIncident["call type code"], 'CW');
        assert.notEqual(lastParsedIncident["date"].indexOf("2015-04-17"), -1);
        assert.equal(lastParsedIncident["call type code"], 'CW');        done();
      });
    });

    it('should perform case insenstive search', (done) => {
      this.request.get('/api/v1/incidents?neighborhood=PaCIFIc BeACH&call_code=cW', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        var firstParsedIncident = parsed[0]
        var lastParsedIncident = parsed[parsed.length - 1]
        assert.equal(firstParsedIncident["neighborhood"], "Pacific Beach");
        assert.equal(firstParsedIncident["call type code"], 'CW');
        assert.equal(lastParsedIncident["neighborhood"], "Pacific Beach");
        assert.equal(lastParsedIncident["call type code"], 'CW');
        done();
      });
    });

    it('should retrun invalid reques if bad search param received', (done) => {
      this.request.get('/api/v1/incidents?bad=not a param', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        assert.deepEqual(parsed, {"invalid_request": "unrecognized search parameter"});
        done();
      });
    });


  });

});
