var models  = require('../models');

exports.getDispositions = function(req, res) {
  models.Disposition.findAll().then(function(dispositions) {
    return res.json(dispositions)
  });
};
