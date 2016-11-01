'use strict';

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
        var masterTempTable = "SELECT Beat.id, Beat.neighborhood, count(Incidents.id) AS num_incidents, 0 AS num_arrests, 0 as num_mental_health_incidents, 0 as num_transient_incidents into temporary pstats FROM beats AS Beat LEFT OUTER JOIN incidents AS Incidents ON Beat.id = Incidents.beat_id GROUP BY Beat.id, Beat.neighborhood;";

        var arrestTempTable = "SELECT Beat.id, Beat.neighborhood, count(IncidentsA.id) AS num_arrests into temporary pstats_a FROM beats AS Beat LEFT OUTER JOIN incidents AS IncidentsA ON Beat.id = IncidentsA.beat_id LEFT OUTER JOIN dispositions AS DispositionsA ON IncidentsA.disposition_id = DispositionsA.id where DispositionsA.code LIKE 'A%' GROUP BY Beat.id, Beat.neighborhood;";

        var updateMasterWithArrests = "UPDATE pstats p set num_arrests = (select NULLIF (a.num_arrests, 0) from pstats_a a where p.id = a.id AND p.neighborhood = a.neighborhood);";

        var mentalHealthTempTable = "SELECT Beat.id, Beat.neighborhood, count(IncidentsM.id) AS num_mental_health_incidents into temporary pstats_m FROM beats AS Beat LEFT OUTER JOIN incidents AS IncidentsM ON Beat.id = IncidentsM.beat_id LEFT OUTER JOIN dispositions AS DispositionsM ON IncidentsM.disposition_id = DispositionsM.id where DispositionsM.code LIKE '%M%' GROUP BY Beat.id, Beat.neighborhood;";

        var updateMasterWithMH = "UPDATE pstats p set num_mental_health_incidents = (select m.num_mental_health_incidents from pstats_m m where p.id = m.id AND p.neighborhood = m.neighborhood);";

        var transientTempTable = "SELECT Beat.id, Beat.neighborhood, count(IncidentsT.id) AS num_transient_incidents into temporary pstats_t FROM beats AS Beat LEFT OUTER JOIN incidents AS IncidentsT ON Beat.id = IncidentsT.beat_id LEFT OUTER JOIN dispositions AS DispositionsT ON IncidentsT.disposition_id = DispositionsT.id where DispositionsT.code LIKE '%T' GROUP BY Beat.id, Beat.neighborhood;";

        var updateMasterWithTransient = "UPDATE pstats p set num_transient_incidents = (select t.num_transient_incidents from pstats_t t where p.id = t.id AND p.neighborhood = t.neighborhood);";

        var finalMasterTable = "SELECT id, COALESCE(neighborhood, 'n/a') as neighborhood, CAST(num_incidents AS INTEGER) AS num_incidents, COALESCE(num_arrests, 0) as num_arrests, COALESCE(num_mental_health_incidents, 0) AS num_mental_health_incidents, COALESCE(num_transient_incidents, 0) AS num_transient_incidents from pstats where neighborhood != 'n/a';";

        var dropTables = "DROP TABLE pstats; DROP TABLE pstats_a; DROP TABLE pstats_m; DROP TABLE pstats_t;";


        return sequelize.query(masterTempTable +
                               arrestTempTable +
                               updateMasterWithArrests +
                               mentalHealthTempTable +
                               updateMasterWithMH +
                               transientTempTable +
                               updateMasterWithTransient +
                               finalMasterTable +
                               dropTables )
      },
      summaryStatsByDispCategory: function() {
        var masterTempTable = "SELECT Beat.id, Beat.neighborhood, 0 AS num_arrests, 0 AS num_reports, 0 as num_no_reports, 0 as num_unfounded, 0 as num_other into temporary pstats FROM beats AS Beat LEFT OUTER JOIN incidents AS Incidents ON Beat.id = Incidents.beat_id GROUP BY Beat.id, Beat.neighborhood;";

        var arrestTempTable = "SELECT Beat.id, Beat.neighborhood, count(IncidentsA.id) AS num_arrests into temporary pstats_a FROM beats AS Beat LEFT OUTER JOIN incidents AS IncidentsA ON Beat.id = IncidentsA.beat_id LEFT OUTER JOIN dispositions AS DispositionsA ON IncidentsA.disposition_id = DispositionsA.id where DispositionsA.code LIKE 'A%' GROUP BY Beat.id, Beat.neighborhood;";

        var updateMasterWithArrests = "UPDATE pstats p set num_arrests = (select NULLIF (a.num_arrests, 0) from pstats_a a where p.id = a.id AND p.neighborhood = a.neighborhood);";

        var reportTempTable = "SELECT Beat.id, Beat.neighborhood, count(IncidentsR.id) AS num_reports into temporary pstats_r FROM beats AS Beat LEFT OUTER JOIN incidents AS IncidentsR ON Beat.id = IncidentsR.beat_id LEFT OUTER JOIN dispositions AS DispositionsR ON IncidentsR.disposition_id = DispositionsR.id where DispositionsR.code LIKE 'R%' GROUP BY Beat.id, Beat.neighborhood;";

        var updateMasterWithReports = "UPDATE pstats p set num_reports = (select r.num_reports from pstats_r r where p.id = r.id AND p.neighborhood = r.neighborhood);";

        var noReportTempTable = "SELECT Beat.id, Beat.neighborhood, count(IncidentsNR.id) AS num_no_reports into temporary pstats_nr FROM beats AS Beat LEFT OUTER JOIN incidents AS IncidentsNR ON Beat.id = IncidentsNR.beat_id LEFT OUTER JOIN dispositions AS DispositionsNR ON IncidentsNR.disposition_id = DispositionsNR.id where DispositionsNR.code LIKE 'K%' GROUP BY Beat.id, Beat.neighborhood;";

        var updateMasterWithNoReports = "UPDATE pstats p set num_no_reports = (select nr.num_no_reports from pstats_nr nr where p.id = nr.id AND p.neighborhood = nr.neighborhood);";

        var unfoundedTempTable = "SELECT Beat.id, Beat.neighborhood, count(IncidentsU.id) AS num_unfounded into temporary pstats_u FROM beats AS Beat LEFT OUTER JOIN incidents AS IncidentsU ON Beat.id = IncidentsU.beat_id LEFT OUTER JOIN dispositions AS DispositionsU ON IncidentsU.disposition_id = DispositionsU.id where DispositionsU.code LIKE 'U%' GROUP BY Beat.id, Beat.neighborhood;";

        var updateMasterWithUnfounded = "UPDATE pstats p set num_unfounded = (select u.num_unfounded from pstats_u u where p.id = u.id AND p.neighborhood = u.neighborhood);";

        var otherTempTable = "SELECT Beat.id, Beat.neighborhood, count(IncidentsO.id) AS num_other into temporary pstats_o FROM beats AS Beat LEFT OUTER JOIN incidents AS IncidentsO ON Beat.id = IncidentsO.beat_id LEFT OUTER JOIN dispositions AS DispositionsO ON IncidentsO.disposition_id = DispositionsO.id where DispositionsO.code LIKE 'O%' GROUP BY Beat.id, Beat.neighborhood;";

        var updateMasterWithOther = "UPDATE pstats p set num_other = (select o.num_other from pstats_o o where p.id = o.id AND p.neighborhood = o.neighborhood);";

        var finalMasterTable = "SELECT id, COALESCE(neighborhood, 'n/a') as neighborhood, num_arrests, num_reports, num_no_reports, num_unfounded, num_other from pstats where neighborhood != 'n/a';";

        var dropTables = "DROP TABLE pstats; DROP TABLE pstats_a; DROP TABLE pstats_r; DROP TABLE pstats_nr; DROP TABLE pstats_u; DROP TABLE pstats_o;";


        return sequelize.query(masterTempTable +
                               arrestTempTable +
                               updateMasterWithArrests +
                               reportTempTable +
                               updateMasterWithReports +
                               noReportTempTable +
                               updateMasterWithNoReports +
                               unfoundedTempTable +
                               updateMasterWithUnfounded +
                               otherTempTable +
                               updateMasterWithOther +
                               finalMasterTable +
                               dropTables )
      }
    },
    underscored: true,
    timestamps: false,
    tableName: 'beats'
  });
  return Beat;
};
