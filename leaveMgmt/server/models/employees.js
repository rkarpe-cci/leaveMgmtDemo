'use strict'
var bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const constants = require('../utils/constants')
module.exports = (sequelize, DataTypes) => {
  const employees = sequelize.define('employees', {
    firstName: DataTypes.STRING,
    lastname: DataTypes.STRING,
    address: DataTypes.STRING,
    dateofJoining: DataTypes.DATE,
    panCardNo: DataTypes.STRING,
    dob: DataTypes.DATE,
    userName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {})
  employees.associate = function (models) {
    // associations can be defined here
    employees.belongsTo(models.empTypes, {
      foreignKey: 'empTypeId',
      allowNull: false,
      onDelete: 'CASCADE'
    })
    employees.hasMany(models.leaves, {
      foreignKey: 'empId',
      as: 'empLeaves'
    })
    employees.hasMany(models.empLeaves, {
      foreignKey: 'empId',
      as: 'eachEmpLeaves'
    })

  }
  employees.prototype.createToken = function () {
    return jwt.sign({ id: this.id }, constants.JWT_SECRET)
  };
  employees.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
    // const match= await bcrypt.compareSync(password, this.password);
  };
  employees.prototype.toAuthJSON = function () {
    return {
      token: 'jwt' + ' ' + this.createToken(),
      ...this.toJSON()
    }
  };
  employees.prototype.toJSON = function () {
    return {
      id: this.id,
      username: this.userName,
      email: this.email
    }
  };
  return employees
}
