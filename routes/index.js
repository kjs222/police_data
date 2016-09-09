var models  = require('../models');
var express = require('express');
var router = express.Router();
var pg = require('pg');
// not sure if about is needed?
// var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/police_data';

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

    // var results = [];
    //
    // // Get a Postgres client from the connection pool
    // pg.connect(connectionString, function(err, client, done) {
    //     // Handle connection errors
    //     if(err) {
    //       done();
    //       console.log(err);
    //       return res.status(500).json({ success: false, data: err});
    //     }
    //
    //     // SQL Query > Select Data
    //     var query = client.query("SELECT * FROM call_types ORDER BY code ASC;");
    //
    //     // Stream results back one row at a time
    //     query.on('row', function(row) {
    //         results.push(row);
    //     });
    //
    //     // After all data is returned, close connection and return results
    //     query.on('end', function() {
    //         done();
    //         return res.json(results);
    //     });
    //
    // });

// });
