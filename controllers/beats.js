var models  = require('../models');

exports.getBeats = function(req, res) {
  models.Beat.findAll().then(function(beats) {
    return res.json(beats)
  });
};
