var models  = require('../models');

exports.getCallTypes = function(req, res) {
  models.CallType.findAll().then(function(callTypes) {
    return res.json(callTypes)
  });
};
