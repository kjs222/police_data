var models  = require('../models');

exports.getBeats = function(req, res) {
  models.Beat.findAll({order: '"number" ASC'}).then(function(beats) {
    for(b in beats) {
      beats[b] = {number: beats[b].number, neighborhood: beats[b].neighborhood}
    };
    return res.json(beats)
  });
};
