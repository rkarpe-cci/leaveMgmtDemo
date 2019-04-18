'use strict'
module.exports = (sequelize, DataTypes) => {
  const empTypes = sequelize.define('empTypes', {
    empTypeName: DataTypes.STRING
  }, {})
  empTypes.associate = function (models) {
    // associations can be defined here
    empTypes.hasMany(models.leavetypes, {
      foreignKey: 'leaveTypeId',
      as: 'types'
    })
  }
  return empTypes
}
