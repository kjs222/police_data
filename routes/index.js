var models  = require('../models');
var express = require('express');
var router = express.Router();
var pg = require('pg');

var callTypesController = require('../controllers/calltypes');
var beatsController = require('../controllers/beats');
var dispositionsController = require('../controllers/dispositions');
var incidentsController = require('../controllers/incidents');
var statsController = require('../controllers/stats');

router.get('/', function(req, res, next) {
  res.sendfile('public/index.html');
});

router.get('/documentation', function(req, res, next) {
  res.sendfile('public/dist/index.html');
});

router.route('/api/v1/call_types')
  .get(callTypesController.getCallTypes);

router.route('/api/v1/dispositions')
  .get(dispositionsController.getDispositions);

router.route('/api/v1/beats')
  .get(beatsController.getBeats);

router.route('/api/v1/neighborhood_names')
  .get(beatsController.getNeighborhoodNames);

router.route('/api/v1/incidents')
  .get(incidentsController.getIncidents);

router.route('/api/v1/incidents_months')
  .get(incidentsController.getMonthYears);

router.route('/api/v1/stats/overview_stats')
  .get(statsController.getOverviewStats);

router.route('/api/v1/stats/disposition_category_stats')
  .get(statsController.getDispCategoryStats);

router.route('/api/v1/stats/neigh_incident_stats')
  .get(statsController.getNeighIncidentStats);

module.exports = router;

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`);
  });
}
