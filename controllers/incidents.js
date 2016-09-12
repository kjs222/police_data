var models  = require('../models');
const querystring = require('querystring');

exports.getIncidents = function(req, res) {
  if(Object.keys(req.query).length > 0) {
    searchResults(req, res);
  } else {
    allIncidents(req, res)
  };
};

var searchResults = function(req, res) {
  models.Incident.findAll({where: req.query, limit: 100, include: [ models.Beat, models.Disposition, models.CallType ]}).then(function(incidents) {
    for(i in incidents) {
      incidents[i] = incidents[i].serialize();
    }
    return res.json(incidents);
  });
}

var allIncidents = function(req, res) {
  // maybe move this top stuff to model - which returns incidents
  // and this just does the json part?
  models.Incident.findAll({where: req.query, limit: 100, include: [ models.Beat, models.Disposition, models.CallType ]}).then(function(incidents) {
    for(i in incidents) {
      incidents[i] = incidents[i].serialize();
    }
    return res.json(incidents);
  });
}

// {beat_number: Beat.number, ad}
