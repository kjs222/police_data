var models  = require('../models');

exports.getIncidents = function(req, res) {
  models.Incident.findAll({limit: 100}).then(function(incidents) {
    return res.json(incidents)
  });
};
