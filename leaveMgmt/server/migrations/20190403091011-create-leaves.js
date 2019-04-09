'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('leaves', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fromDate: {
        type: Sequelize.DATE
      },
      toDate: {
        type: Sequelize.DATE
      },
      reasonofleave: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.TINYINT
      },
      noOfDays: {
        type: Sequelize.DOUBLE
      },
      medicalCertPath: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      leaveTypeId:{
        type:Sequelize.INTEGER,
        onDelete:'CASCADE',
        allowNull:false,
        references:{
          model:'leavetypes',
          key:'id',
          as:'leaveTypeId'
        },
      },
      empId:{
        type:Sequelize.INTEGER,
        onDelete:'CASCADE',
        allowNull:false,
        references:{
          model:'employees',
          key:'id',
          as:'empId'
        },
      },
      isHalfDay:{
        type: Sequelize.TINYINT
      },
      isMorningHalf:{
        type: Sequelize.TINYINT
      },
      // isNonPaidLeave:{
      //   type: Sequelize.TINYINT
      // },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('leaves');
  }
};