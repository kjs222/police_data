var models  = require('../models');

exports.getIncidents = function(req, res) {
  models.Incident.findAll({limit: 100, include: [ models.Beat, models.Disposition, models.CallType ]}).then(function(incidents) {
    for(i in incidents) {
      incidents[i] = incidents[i].serialize();
    }
    return res.json(incidents);
  });
};
