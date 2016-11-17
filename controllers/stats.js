var models  = require('../models');
var StatsSerializer = require('../serializers/stats-serializer')
var statsSerializer = new StatsSerializer();
var cacheManager = require('cache-manager');
var memoryCache = cacheManager.caching({store: 'memory', max: 100, ttl: 10000000/*seconds*/});

exports.getOverviewStats = function(req, res) {
  var cacheKey = 'overview-stats';
  var ttl = 10000000;
  memoryCache.get(cacheKey, function(err, result) {
      console.log("looking for cache")
      if (result !== undefined){ console.log("found cache"); return res.json(result);}
  });
  memoryCache.wrap(cacheKey, function (cacheCb) {
    console.log("Fetching data from slow database");
    models.Beat.summaryStats().then(function(data) {
      memoryCache.set(cacheKey, data, {ttl: ttl}, function(err) {
          return res.json(data);
      });
    }, cacheCb);
  })
};


exports.getDispCategoryStats = function(req, res) {
  var neighborhood = req.query["neighborhood"] || "Gaslamp";
  models.Beat.statsByDispCategory(neighborhood).then(function(stats) {
     stats = stats.length === 2 ? stats[0] : stats;
    statsSerializer.serializeDispositionStats(stats);
     return res.json(stats)
  });
};

exports.getNeighIncidentStats = function(req, res) {
  models.Incident.findByNeighAndMonth(models, req.query).then(function(stats) {
    for(i in stats) {
        stats[i] = stats[i].serialize();
    }
     return res.json(stats)
  });
};
