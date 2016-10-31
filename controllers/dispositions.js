var models  = require('../models');

exports.getDispositions = function(req, res) {
  models.Disposition.findAll({order: '"code" ASC'}).then(function(dispositions) {
    for(d in dispositions) {
      dispositions[d] = {code: dispositions[d].code, description: dispositions[d].description}
    };
    return res.json(dispositions)
  });
};
