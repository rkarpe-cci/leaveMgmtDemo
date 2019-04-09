'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('empLeaves', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sickLeave: {
        type: Sequelize.DOUBLE
      },
      casualLeave: {
        type: Sequelize.DOUBLE
      },
      earnedLeave: {
        type: Sequelize.DOUBLE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      empId:{
        type:Sequelize.INTEGER,
        onDelete:'CASCADE',
        allowNull:false,
        references:{
          model:'employees',
          key:'id',
          as:'empLeaveId'
        },
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('empLeaves');
  }
};