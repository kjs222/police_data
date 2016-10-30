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
        return sequelize.query("SELECT Beat.id, Beat.neighborhood, count(Incidents.id) AS num_incidents FROM beats AS Beat LEFT OUTER JOIN incidents AS Incidents ON Beat.id = Incidents.beat_id GROUP BY Beat.id, Beat.neighborhood")
      },
      arrestCount: function() {
        return sequelize.query("SELECT Beat.id, Beat.neighborhood, count(Incidents.id) AS num_arrests FROM beats AS Beat LEFT OUTER JOIN incidents AS Incidents ON Beat.id = Incidents.beat_id LEFT OUTER JOIN dispositions AS Dispositions ON Incidents.disposition_id = Dispositions.id WHERE Dispositions.code LIKE 'A%' GROUP BY Beat.id")
      },
      mhRelatedCount: function() {
        return sequelize.query("SELECT Beat.id, Beat.neighborhood, count(Incidents.id) AS num_mental_health_incidents FROM beats AS Beat LEFT OUTER JOIN incidents AS Incidents ON Beat.id = Incidents.beat_id LEFT OUTER JOIN dispositions AS Dispositions ON Incidents.disposition_id = Dispositions.id WHERE Dispositions.code LIKE '%M' GROUP BY Beat.id")
      },
      transientRelatedCount: function() {
        return sequelize.query("SELECT Beat.id, Beat.neighborhood, count(Incidents.id) AS num_transient_incidents FROM beats AS Beat LEFT OUTER JOIN incidents AS Incidents ON Beat.id = Incidents.beat_id LEFT OUTER JOIN dispositions AS Dispositions ON Incidents.disposition_id = Dispositions.id WHERE Dispositions.code LIKE '%T' GROUP BY Beat.id")
      },
      summaryStats: function() {
        return sequelize.query("SELECT Beat.id, Beat.neighborhood, count(Incidents.id) AS num_incidents, 0 AS num_arrests, 0 as num_mental_health_incidents, 0 as num_transient_incidents into temporary pstats FROM beats AS Beat LEFT OUTER JOIN incidents AS Incidents ON Beat.id = Incidents.beat_id GROUP BY Beat.id, Beat.neighborhood; SELECT Beat.id, Beat.neighborhood, count(IncidentsA.id) AS num_arrests into temporary pstats_a FROM beats AS Beat LEFT OUTER JOIN incidents AS IncidentsA ON Beat.id = IncidentsA.beat_id LEFT OUTER JOIN dispositions AS DispositionsA ON IncidentsA.disposition_id = DispositionsA.id where DispositionsA.code LIKE 'A%' GROUP BY Beat.id, Beat.neighborhood;UPDATE pstats p set num_arrests = (select a.num_arrests from pstats_a a where p.id = a.id AND p.neighborhood = a.neighborhood);SELECT Beat.id, Beat.neighborhood, count(IncidentsM.id) AS num_mental_health_incidents into temporary pstats_m FROM beats AS Beat LEFT OUTER JOIN incidents AS IncidentsM ON Beat.id = IncidentsM.beat_id LEFT OUTER JOIN dispositions AS DispositionsM ON IncidentsM.disposition_id = DispositionsM.id where DispositionsM.code LIKE '%M%' GROUP BY Beat.id, Beat.neighborhood; UPDATE pstats p set num_mental_health_incidents = (select m.num_mental_health_incidents from pstats_m m where p.id = m.id AND p.neighborhood = m.neighborhood); SELECT Beat.id, Beat.neighborhood, count(IncidentsT.id) AS num_transient_incidents into temporary pstats_t FROM beats AS Beat LEFT OUTER JOIN incidents AS IncidentsT ON Beat.id = IncidentsT.beat_id LEFT OUTER JOIN dispositions AS DispositionsT ON IncidentsT.disposition_id = DispositionsT.id where DispositionsT.code LIKE '%T' GROUP BY Beat.id, Beat.neighborhood; UPDATE pstats p set num_transient_incidents = (select t.num_transient_incidents from pstats_t t where p.id = t.id AND p.neighborhood = t.neighborhood); SELECT * from pstats")
      }
    },
    underscored: true,
    timestamps: false,
    tableName: 'beats'
  });
  return Beat;
};
