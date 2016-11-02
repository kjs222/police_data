var models  = require('../models');

exports.getBeats = function(req, res) {
  models.Beat.findAll({order: '"number" ASC'}).then(function(beats) {
    for(b in beats) {
      beats[b] = {number: beats[b].number, neighborhood: beats[b].neighborhood}
    };
    return res.json(beats)
  });
};

exports.getNeighborhoodNames = function(req, res) {
  models.Beat.findAll({ order: '"neighborhood" ASC',
                        attributes: ['neighborhood'],
                        where: {neighborhood: { ne: null } }
                      })
              .then(function(neighborhoodNames) {
                  var names = neighborhoodNames.map(function(name){
                    return name["neighborhood"];
                  });
                  return res.json(names);
  });
};
