var models  = require('../models');
var express = require('express');
var router = express.Router();
var pg = require('pg');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

router.get('/api/v1/call_types', function(req, res) {
  models.CallType.findAll().then(function(callTypes) {
    return res.json(callTypes)
  });
});

router.get('/api/v1/dispositions', function(req, res) {
  models.Disposition.findAll().then(function(dispositions) {
    return res.json(dispositions)
  });
});

router.get('/api/v1/beats', function(req, res) {
  models.Beat.findAll().then(function(beats) {
    return res.json(beats)
  });
});

router.get('/api/v1/incidents', function(req, res) {
  models.Incident.findAll({ limit: 100 }).then(function(incidents) {
    return res.json(incidents)
  });
});
