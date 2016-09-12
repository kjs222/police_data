var models  = require('../models');
const querystring = require('querystring');



exports.getIncidents = function(req, res) {
  if(Object.keys(req.query).length > 0 && req.query.constructor === Object) {
    return res.json(req.query)
  } else {
    models.Incident.findAll({limit: 100, include: [ models.Beat, models.Disposition, models.CallType ]}).then(function(incidents) {
      for(i in incidents) {
        incidents[i] = incidents[i].serialize();
      }
      return res.json(incidents);
    });
  };
};
