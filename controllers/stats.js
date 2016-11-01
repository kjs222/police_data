var models  = require('../models');
const querystring = require('querystring');

exports.getOverviewStats = function(req, res) {
  models.Beat.summaryStats().then(function(stats) {
     return res.json(stats)
  });
};

exports.getDispCategoryStats = function(req, res) {
  models.Beat.statsByDispCategory().then(function(stats) {
     return res.json(stats)
  });
};
