'use strict'
module.exports = (sequelize, DataTypes) => {
  const leaves = sequelize.define('leaves', {
    fromDate: DataTypes.DATE,
    toDate: DataTypes.DATE,
    reasonofleave: DataTypes.STRING,
    status: DataTypes.TINYINT,
    noOfDays: DataTypes.DOUBLE,
    medicalCertPath: DataTypes.STRING,
    isHalfDay: DataTypes.TINYINT,
    isMorningHalf: DataTypes.TINYINT,
    isUnpaiPaidLeave:DataTypes.TINYINT
  }, {})
  leaves.associate = function (models) {
    // associations can be defined here
    leaves.belongsTo(models.leavetypes, {
      foreignKey: 'leaveTypeId',
      allowNull: false,
      onDelete: 'CASCADE'
    })
    leaves.belongsTo(models.employees, {
      foreignKey: 'empId',
      allowNull: false,
      onDelete: 'CASCADE'
    })
  }
  return leaves
}
