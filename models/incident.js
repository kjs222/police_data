'use strict';
var models  = require('../models');
var dateFormat = require('dateformat');

module.exports = function(sequelize, DataTypes) {
  var Incident = sequelize.define('Incident', {
    number: DataTypes.STRING,
    date: DataTypes.DATE,
    street_number: DataTypes.STRING,
    street_dir: DataTypes.STRING,
    street: DataTypes.STRING,
    street_type: DataTypes.STRING,
    street_dir2: DataTypes.STRING,
    street_name2: DataTypes.STRING,
    street_type2: DataTypes.STRING,
    priority: DataTypes.STRING
  }, {
    instanceMethods: {
      formatAddress: function() {
        var formatted = this.street_number + " " + this.street + " " + this.street_type
        formatted = formatted.replace(" NA ", " ")
        if(formatted.slice(-2) === "NA") {
          formatted = formatted.slice(0,-3);
        }
        if(formatted.slice(0, 2) === "NA ") {
          formatted = formatted.slice(3);
        }
        return formatted;
      },
      formatDate: function() {
        return dateFormat(this.date, "dd mmm yyyy HH:MM");
      },
      serialize: function() {
        return {"incident number": this.number,
                "date": this.formatDate(),
                "address": this.formatAddress(),
                "priority": this.priority,
                "beat": this.Beat.number,
                "neighborhood": this.Beat.neighborhood,
                "disposition code": this.Disposition.code,
                "disposition type": this.Disposition.code[0],
                "disposition description": this.Disposition.description,
                "call type code": this.CallType.code,
                "call type description": this.CallType.description
              }
      }
    },
    classMethods: {
      associate: function(models) {
        Incident.belongsTo(models.CallType, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
        Incident.belongsTo(models.Beat, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
        Incident.belongsTo(models.Disposition, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      },
      findByQuery: function(models, query, page) {
        var page = page || 1;
        var offset = 100 * (page - 1);
        console.log(query);
        return Incident.findAndCountAll({
                        where: query,
                        offset: offset,
                        limit: 100,
                        order: '"date" ASC',
                        include: [ {model: models.Beat}, {model: models.Disposition},{model: models.CallType}]
        });
      },
      findByNeighAndMonth: function(models, query) {
        var neighborhood = query["neighborhood"];
        var code = query["code"];
        var start = new Date(query["month"]);
        var end = new Date(start.getFullYear(), start.getMonth()+1, 1)
        return Incident.findAll({
                        where: {'Beat.neighborhood': neighborhood,
                                'date': {gte: start, lt: end},
                                'Disposition.code': {like: "%" + code },
                        },
                        order: '"date" ASC',
                        include: [ {model: models.Beat}, {model: models.Disposition},{model: models.CallType}]
                      });
      }
    },
    underscored: true,
    timestamps: false,
    tableName: 'incidents'
  });
  return Incident;
};
