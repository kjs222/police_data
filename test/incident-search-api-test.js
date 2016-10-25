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
      var incNum = 'P16070041611'
      this.request.get('/api/v1/incidents?number=' + incNum, (error, response) => {
        if (error) { done(error); }
        var parsedIncident = JSON.parse(response.body)[0]
        assert.equal(parsedIncident["incident number"], incNum);
        assert.equal(parsedIncident["neighborhood"], 'Pacific Beach');
        done();
      });
    });

    it('should search by priority', (done) => {
      var priority = '3'
      this.request.get('/api/v1/incidents?priority=' + priority, (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body);
        var parsedIncident = parsed[0];
        assert.isAtLeast(parsed.length, 100);
        assert.equal(parsedIncident["priority"], priority);
        done();
      });
    });

    it('should search by beat', (done) => {
      var beatNum = '122';
      var beatNeighborhood = 'Pacific Beach';
      this.request.get('/api/v1/incidents?beat=' + beatNum, (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        var parsedIncident = parsed[0]
        assert.isAtLeast(parsed.length, 100);
        assert.equal(parsedIncident["beat"], beatNum);
        assert.equal(parsedIncident["neighborhood"], beatNeighborhood);
        done();
      });
    });

    it('should search by neighborhood', (done) => {
      var beatNum = '122';
      var beatNeighborhood = 'Pacific Beach';
      this.request.get('/api/v1/incidents?neighborhood=' + beatNeighborhood, (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        var parsedIncident = parsed[0]
        assert.isAtLeast(parsed.length, 100);
        assert.equal(parsedIncident["beat"], beatNum);
        assert.equal(parsedIncident["neighborhood"], beatNeighborhood);
        done();
      });
    });

    it('should search by disposition code', (done) => {
      var dispCode = 'K';
      this.request.get('/api/v1/incidents?disp_code=' + dispCode, (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body);
        var parsedIncident = parsed[0];
        assert.isAtLeast(parsed.length, 100);
        assert.equal(parsedIncident["disposition code"], dispCode);
        done();
      });
    });

    it('should search by disposition description', (done) => {
      var dispDescription = "NO REPORT REQUIRED";
      var dispCode = 'K';
      this.request.get('/api/v1/incidents?disp_desc=' + dispDescription, (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body);
        var parsedIncident = parsed[0];
        assert.isAtLeast(parsed.length, 100);
        assert.equal(parsedIncident["disposition code"], dispCode);
        assert.equal(parsedIncident["disposition description"], dispDescription);
        done();
      });
    });

    it('should search by call code', (done) => {
      var callCode = 'CW';
      var callCodeDescription = 'CHECK THE WELFARE';
      this.request.get('/api/v1/incidents?call_code=' + callCode, (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        var parsedIncident = parsed[0]
        assert.isAtLeast(parsed.length, 100);
        assert.equal(parsedIncident["call type code"], callCode);
        assert.equal(parsedIncident["call type description"], callCodeDescription);
        done();
      });
    });

    it('should search by call type description', (done) => {
      var callCode = 'CW';
      var callCodeDescription = 'CHECK THE WELFARE';
      this.request.get('/api/v1/incidents?call_desc=' + callCodeDescription, (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        var parsedIncident = parsed[0]
        assert.isAtLeast(parsed.length, 100);
        assert.equal(parsedIncident["call type code"], callCode);
        assert.equal(parsedIncident["call type description"], callCodeDescription);
        done();
      });
    });

    it('should search by street', (done) => {
      var street = 'EL CAJON';
      this.request.get('/api/v1/incidents?street=' + street, (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        var parsedIncident = parsed[0]
        assert.notEqual(parsedIncident["address"].indexOf(street), -1);
        done();
      });
    });

    it('should search by street number', (done) => {
      var streetNum = '4100'
      this.request.get('/api/v1/incidents?street_number=' + streetNum, (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body);
        var parsedIncident = parsed[0];
        assert.notEqual(parsedIncident["address"].indexOf(streetNum), -1);
        done();
      });
    });

    it('should search by date', (done) => {
      var date = '2015-04-17';
      this.request.get('/api/v1/incidents?date=' + date, (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body);
        var firstParsedIncident = parsed[0];
        var lastParsedIncident = parsed[parsed.length - 1];
        assert.notEqual(firstParsedIncident["date"].indexOf(date), -1);
        assert.notEqual(lastParsedIncident["date"].indexOf(date), -1);
        done();
      });
    });


    it('should search by date range', (done) => {
      var start = '2015-04-17';
      var end = '2015-04-18'
      this.request.get('/api/v1/incidents?start_date=' + start + '&end_date=' + end, (error, response) => {
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
      var date = '2015-04-17';
      var callCode = 'CW';
      this.request.get('/api/v1/incidents?date=' + date + '&call_code=' + callCode, (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        var firstParsedIncident = parsed[0];
        var lastParsedIncident = parsed[parsed.length - 1];
        assert.notEqual(firstParsedIncident["date"].indexOf(date), -1);
        assert.equal(firstParsedIncident["call type code"], callCode);
        assert.notEqual(lastParsedIncident["date"].indexOf(date), -1);
        assert.equal(lastParsedIncident["call type code"], callCode);
        done();
      });
    });

    it('should perform case insenstive search', (done) => {
      var searchNeigh = "PaCIFIc BeACH";
      var searchCode = 'cW';
      this.request.get('/api/v1/incidents?neighborhood='+ searchNeigh+'&call_code=' + searchCode, (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body);
        var firstParsedIncident = parsed[0];
        var lastParsedIncident = parsed[parsed.length - 1];
        assert.equal(firstParsedIncident["neighborhood"], "Pacific Beach");
        assert.equal(firstParsedIncident["call type code"], 'CW');
        assert.equal(lastParsedIncident["neighborhood"], "Pacific Beach");
        assert.equal(lastParsedIncident["call type code"], 'CW');
        done();
      });
    });

    it('should retrun invalid reques if bad search param received', (done) => {
      var badParam = 'bad';
      this.request.get('/api/v1/incidents?'+ badParam+'=not a param', (error, response) => {
        if (error) { done(error); }
        var parsed = JSON.parse(response.body)
        assert.deepEqual(parsed, {"invalid_request": "unrecognized search parameter"});
        done();
      });
    });


  });

});
