var models  = require('../models');
var IncidentsSerializer = require('../serializers/incidents-serializer')
var incidentsSerializer = new IncidentsSerializer();
const querystring = require('querystring');

exports.getIncidents = function(req, res) {
  allIncidents(req, res)
};

var allIncidents = function(req, res) {
  var searchQuery = incidentsSerializer.transformQuery(req.query);
  if (searchQuery["invalid_parameter"]) {
    return res.json({invalid_request: "unrecognized search parameter"})
  };
  models.Incident.findByQuery(models, searchQuery, req.query["page"])
  .then(function(results) {
    incidentsSerializer.serialize(results);
    return res.json(results);
  });
};

exports.getMonthYears = function(req, res) {
  models.Incident.getMonthYears()
  .then(function(results) {
    var monthYears = results.map(function(result){
      return result["month_years"];
    });
    return res.json(monthYears);
  });
};
