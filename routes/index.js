var models  = require('../models');
var express = require('express');
var router = express.Router();
var pg = require('pg');

var callTypesController = require('../controllers/calltypes');
var beatsController = require('../controllers/beats');
var dispositionsController = require('../controllers/dispositions');
var incidentsController = require('../controllers/incidents');

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

router.route('/api/v1/incidents')
  .get(incidentsController.getIncidents);

module.exports = router;

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`);
  });
}
