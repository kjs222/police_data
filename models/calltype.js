'use strict';
module.exports = function(sequelize, DataTypes) {
  var CallType = sequelize.define('CallType', {
    code: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        CallType.hasMany(models.Incident);
        // associations can be defined here
      }
    },
    underscored: true,
    timestamps: false,
    tableName: 'call_types'
  });
  return CallType;
};
