'use strict';
module.exports = function(sequelize, DataTypes) {
  var Beat = sequelize.define('Beat', {
    number: DataTypes.INTEGER,
    neighborhood: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Beat.hasMany(models.Incident);
      }
    },
    underscored: true,
    timestamps: false,
    tableName: 'beats'
  });
  return Beat;
};
