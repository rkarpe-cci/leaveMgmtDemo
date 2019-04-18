'use strict'
module.exports = (sequelize, DataTypes) => {
  const annualHolidays = sequelize.define('annualHolidays', {
    holidaydate: DataTypes.DATE,
    title: DataTypes.STRING,
    description: DataTypes.STRING
  }, {})
  annualHolidays.associate = function (models) {
    // associations can be defined here
  }
  return annualHolidays
}
