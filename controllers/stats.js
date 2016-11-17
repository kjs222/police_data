var models  = require('../models');
var StatsSerializer = require('../serializers/stats-serializer')
var statsSerializer = new StatsSerializer();
var cacheManager = require('cache-manager');
var memoryCache = cacheManager.caching({store: 'memory', max: 100, ttl: 100000/*seconds*/});


// function respond(res, err, data) {
//     if (err) {
//         res.json(500, err);
//     } else {
//         res.json(200, data);
//     }
// }
//
// app.get('/foo/bar', function(req, res) {
//     var cacheKey = 'foo-bar:' + JSON.stringify(req.query);
//     var ttl = 10;
//     memoryCache.wrap(cacheKey, function(cacheCallback) {
//         DB.find(req.query, cacheCallback);
//     }, {ttl: ttl}, function(err, result) {
//         respond(res, err, result);
//     });
// });
//
// exports.getOverviewStats = function(req, res) {
//   var cacheKey = 'overview-stats';
//   var ttl = 100000;
//   memoryCache.wrap(cacheKey, function(cacheCallback) {
//     models.Beat.summaryStats().then(function(stats) {
//        return res.json(stats)
//     });
// };

// memoryCache.get(cacheKey, function(err, result) {
//     if (result !== undefined){res.json({billingAddress12LastName: result});}
// });
//
// memoryCache.wrap(cacheKey, function (cacheCb) {
//     console.log("Fetching count from slow database");
//     table.count().then(data);
//     memoryCache.set(cacheKey, data, {ttl: ttl}, function(err) {
//         res.json({valuesCount: data});
//     });
// }, cb);


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

// exports.getOverviewStats = function(req, res) {
//   models.Beat.summaryStats().then(function(stats) {
//      return res.json(stats)
//   });
// };

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
