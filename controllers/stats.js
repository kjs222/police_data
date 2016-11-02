var models  = require('../models');
var StatsSerializer = require('../serializers/stats-serializer')
var statsSerializer = new StatsSerializer();

exports.getOverviewStats = function(req, res) {
  models.Beat.summaryStats().then(function(stats) {
     return res.json(stats)
  });
};

exports.getDispCategoryStats = function(req, res) {
  var neighborhood = req.query["neighborhood"] || "Gaslamp";
  models.Beat.statsByDispCategory(neighborhood).then(function(stats) {
     statsSerializer.serializeDispositionStats(stats);
     return res.json(stats)
  });
};

exports.getNeighIncidentStats = function(req, res) {
  var neighborhood = req.query["neighborhood"];
  var monthStart = req.query["month"];
  models.Incident.findByNeighAndMonth(models, neighborhood, monthStart).then(function(stats) {
    for(i in stats) {
        // console.log(stats[i])
    }
     return res.json(stats)
  });
};
