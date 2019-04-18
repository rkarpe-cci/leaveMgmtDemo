'use strict'
module.exports = (sequelize, DataTypes) => {
  const leavetypes = sequelize.define('leavetypes', {
    leaveTypeName: DataTypes.STRING,
    noOfLeaves: DataTypes.INTEGER
  }, {})
  leavetypes.associate = function (models) {
    // associations can be defined here
    leavetypes.hasMany(models.leaves, {
      foreignKey: 'leaveTypeId',
      as: 'types'
    })
  }
  return leavetypes
}
