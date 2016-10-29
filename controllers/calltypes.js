var models  = require('../models');

exports.getCallTypes = function(req, res) {
  models.CallType.findAll({order: '"code" ASC'}).then(function(callTypes) {
    for(c in callTypes) {
      callTypes[c] = {code: callTypes[c].code, description: callTypes[c].description}
    };
    return res.json(callTypes)
  });
};
