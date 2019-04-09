'use strict';
module.exports = (sequelize, DataTypes) => {
  const empLeaves = sequelize.define('empLeaves', {
    sickLeave: DataTypes.DOUBLE,
    casualLeave: DataTypes.DOUBLE,
    earnedLeave: DataTypes.DOUBLE
  }, {});
  empLeaves.associate = function(models) {
    // associations can be defined here
    empLeaves.belongsTo(models.employees, {
      foreignKey: 'empId',
      allowNull: false,
      onDelete: 'CASCADE',
    });
  };
  return empLeaves;
};