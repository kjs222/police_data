'use strict';
// var models  = require('../models');
// var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Beat = sequelize.define('Beat', {
    number: DataTypes.INTEGER,
    neighborhood: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Beat.hasMany(models.Incident);
      },
      incidentCount: function() {
        return sequelize.query('SELECT "Beat"."id", "Beat"."neighborhood", count("Incidents"."id") AS "num_incidents" FROM "beats" AS "Beat" LEFT OUTER JOIN "incidents" AS "Incidents" ON "Beat"."id" = "Incidents"."beat_id" GROUP BY "Beat"."id", "Beat"."neighborhood"')
      },
      arrestCount: function() {
        return sequelize.query("SELECT Beat.id, Beat.neighborhood, count(Incidents.id) AS num_arrests FROM beats AS Beat LEFT OUTER JOIN incidents AS Incidents ON Beat.id = Incidents.beat_id LEFT OUTER JOIN dispositions AS Dispositions ON Incidents.disposition_id = Dispositions.id WHERE Dispositions.code LIKE 'A%' GROUP BY Beat.id, Beat.neighborhood")
      },
      mhRelatedCount: function() {
        return sequelize.query("SELECT Beat.id, Beat.neighborhood, count(Incidents.id) AS num_mental_health_incidents FROM beats AS Beat LEFT OUTER JOIN incidents AS Incidents ON Beat.id = Incidents.beat_id LEFT OUTER JOIN dispositions AS Dispositions ON Incidents.disposition_id = Dispositions.id WHERE Dispositions.code LIKE '%M' GROUP BY Beat.id, Beat.neighborhood")
      },
      transientRelatedCount: function() {
        return sequelize.query("SELECT Beat.id, Beat.neighborhood, count(Incidents.id) AS num_transient_incidents FROM beats AS Beat LEFT OUTER JOIN incidents AS Incidents ON Beat.id = Incidents.beat_id LEFT OUTER JOIN dispositions AS Dispositions ON Incidents.disposition_id = Dispositions.id WHERE Dispositions.code LIKE '%T' GROUP BY Beat.id, Beat.neighborhood")
      }
    },
    underscored: true,
    timestamps: false,
    tableName: 'beats'
  });
  return Beat;
};



// sequelize.query("SELECT * FROM `users`", { type: sequelize.QueryTypes.SELECT})
//   .then(function(users) {
//     // We don't need spread here, since only the results will be returned for select queries
//   })
