'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Incidents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      number: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATE
      },
      street_number: {
        type: Sequelize.STRING
      },
      street_dir: {
        type: Sequelize.STRING
      },
      street: {
        type: Sequelize.STRING
      },
      street_type: {
        type: Sequelize.STRING
      },
      street_dir2: {
        type: Sequelize.STRING
      },
      street_name2: {
        type: Sequelize.STRING
      },
      street_type2: {
        type: Sequelize.STRING
      },
      priority: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Incidents');
  }
};