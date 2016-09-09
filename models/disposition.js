'use strict';
module.exports = function(sequelize, DataTypes) {
  var Disposition = sequelize.define('Disposition', {
    code: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Disposition.hasMany(models.Incident);
        // associations can be defined here
      }
    },
    underscored: true,
    timestamps: false,
    tableName: 'dispositions'
  });
  return Disposition;
};
