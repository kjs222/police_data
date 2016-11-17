var models  = require('../models');
var StatsSerializer = require('../serializers/stats-serializer')
var statsSerializer = new StatsSerializer();
var cacheManager = require('cache-manager');
var memoryCache = cacheManager.caching({store: 'memory', max: 100, ttl: 10000000});

exports.getOverviewStats = function(req, res) {
  var cacheKey = 'overview-stats';
  var ttl = 10000000;
  memoryCache.get(cacheKey, function(err, result) { if (result !== undefined){ return res.json(result);}});
  memoryCache.wrap(cacheKey, function (cacheCb) {
    models.Beat.summaryStats().then(function(data) {
      memoryCache.set(cacheKey, data, {ttl: ttl}, function(err) { return res.json(data); });
    }, cacheCb);
  })
};

exports.getDispCategoryStats = function(req, res) {
  var neighborhood = req.query["neighborhood"] || "Gaslamp";
  var cacheKey = 'disp-stats-' + neighborhood;
  var ttl = 10000000;
  memoryCache.get(cacheKey, function(err, result) { if (result !== undefined){return res.json(result);} });
  memoryCache.wrap(cacheKey, function (cacheCb) {
    models.Beat.statsByDispCategory(neighborhood).then(function(stats) {
       stats = stats.length === 2 ? stats[0] : stats;
       statsSerializer.serializeDispositionStats(stats);
       memoryCache.set(cacheKey, stats, {ttl: ttl}, function(err) {
           return res.json(stats);
       });
     }, cacheCb);
  });
};

exports.getArrestStats = function(req, res) {
  var cacheKey = 'map-stats';
  var ttl = 10000000;
  memoryCache.get(cacheKey, function(err, result) { if (result !== undefined){return res.json(result);} });
  memoryCache.wrap(cacheKey, function (cacheCb) {
    models.Beat.arrestCount().then(function(stats) {
       stats = stats.length === 2 ? stats[0] : stats;
       memoryCache.set(cacheKey, stats, {ttl: ttl}, function(err) {
           return res.json(stats);
       });
     }, cacheCb);
  });
};

exports.getNeighIncidentStats = function(req, res) {
  var cacheKey = 'disp-stats-' + req.query.month + "-" + req.query.neighborhood + "-" + req.query.code;
  var ttl = 10000000;
  memoryCache.get(cacheKey, function(err, result) { if (result !== undefined){ return res.json(result);}});
  memoryCache.wrap(cacheKey, function (cacheCb) {
    models.Incident.findByNeighAndMonth(models, req.query).then(function(stats) {
      for(i in stats) { stats[i] = stats[i].serialize(); }
      memoryCache.set(cacheKey, stats, {ttl: ttl}, function(err) {
          return res.json(stats);
      });
    }, cacheCb);
  });
};
