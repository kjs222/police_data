var models  = require('../models');
const querystring = require('querystring');

exports.getNeighborhoodStats = function(req, res) {
  models.Beat.summaryStats().then(function(stats) {
     return res.json(stats)
  });
};
