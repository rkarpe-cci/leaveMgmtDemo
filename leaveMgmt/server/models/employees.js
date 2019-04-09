'use strict';
module.exports = (sequelize, DataTypes) => {
  const employees = sequelize.define('employees', {
    firstName: DataTypes.STRING,
    lastname: DataTypes.STRING,
    address: DataTypes.STRING,
    dateofJoining: DataTypes.DATE,
    panCardNo:DataTypes.STRING,
    dob:DataTypes.DATE
  }, {});
  employees.associate = function (models) {
    // associations can be defined here
    employees.belongsTo(models.empTypes, {
      foreignKey: 'empTypeId',
      allowNull: false,
      onDelete: 'CASCADE',
    });
    employees.hasMany(models.leaves, {
      foreignKey: 'empId',
      as: 'empLeaves',
    });
    employees.hasMany(models.empLeaves, {
      foreignKey: 'empId',
      as: 'eachEmpLeaves',
    });
  };
  return employees;
};