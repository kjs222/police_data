var models  = require('../models');
var IncidentsSerializer = require('../serializers/incidents-serializer')
var incidentsSerializer = new IncidentsSerializer();
const querystring = require('querystring');
var cacheManager = require('cache-manager');
var memoryCache = cacheManager.caching({store: 'memory', max: 100, ttl: 10000000});


exports.getIncidents = function(req, res) {
  allIncidents(req, res)
};

var allIncidents = function(req, res) {
  var searchQuery = incidentsSerializer.transformQuery(req.query);
  if (searchQuery["incidents"]["invalid_parameter"]) {
    return res.json({invalid_request: "unrecognized search parameter"})
  };
  models.Incident.findByQuery(models, searchQuery, req.query["page"])
  .then(function(results) {
    incidentsSerializer.serialize(results);
    return res.json(results);
  });
};

exports.getMonthYears = function(req, res) {
  var cacheKey = 'month-years';
  var ttl = 10000000;
  memoryCache.get(cacheKey, function(err, result) {if (result !== undefined){ return res.json(result);} });
  memoryCache.wrap(cacheKey, function (cacheCb) {
    models.Incident.getMonthYears().then(function(results) {
      if (results.length === 2) { results = results[0] }
      var monthYears = results.map(function(result){ return result["month_years"]; });
      memoryCache.set(cacheKey, monthYears, {ttl: ttl}, function(err) {
          return res.json(monthYears);
        });
      }, cacheCb);
    });
};
