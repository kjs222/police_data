var models  = require('../models');
const querystring = require('querystring');

exports.getNeighborhoodStats = function(req, res) {
  models.Beat.dvRelatedCount().then(function(stats) {
     return res.json(stats)
  });
};


// var neighStats = function(req, res) {
//     models.Beats.findAll({where: searchQuery,
//                           limit: 100,
//                           include: [ models.Beat, models.Disposition, models.CallType ]
//                         })
//                 .then(function(incidents) {
//                     return res.json(incidents);
//                   });
//   };



// Table.findAll({
//   attributes: ['column1',
//     sequelize.fn('count', sequelize.col('column2'))],
//   group: ["Table.column1"]
// }).then(function (result) { });


// return Model.findAll({
//   attributes: ['id', [sequelize.fn('count', sequelize.col('likes.id')), 'likecount']],
//   include: [{ attributes: [], model: Like }],
//   group: ['model.id']
// });
//
// likecount is the attribute the count will be stored under. attributes: [] on the include ensures that no data is actually selected from the like table, just the count


// User.findAll({
//   attributes: ['User.*', 'Post.*', [sequelize.fn('COUNT', 'Post.id'), 'PostCount']],
//   include: [Post]
// }
