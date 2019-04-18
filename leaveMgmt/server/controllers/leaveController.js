const leave = require('../models').leaves
const employeeLeaves = require('../models').empLeaves
const employee = require('../models').employees
const emptypes = require('../models').emptypes
const moment = require('moment')
const test = require('../models/index')
module.exports = {
  create(req, res) {
    console.log(req.file)
    if (req.body.reasonofleave == '') {
      return res.status(404).send({
        message: 'Please specify a reason'
      })
    } else {
      var isHalfDay = req.body.isHalfDay
      var currentTime = new Date()
      var date1 = new Date(req.body.fromDate)
      var newfrom = moment(req.body.fromDate).format('YYYY-MM-DD')
      var date2 = new Date(req.body.toDate)
      var diffTime = (date2.getTime() - date1.getTime())
      var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      console.log(diffDays)
      var leaveTypeId = req.body.leaveTypeId
      var currentYear = currentTime.getFullYear()
      var monthFrom = date1.getMonth() + 1
      var day = date1.getDate()
      var year = date1.getFullYear()
      var toYear = date2.getFullYear()
      var oneMonthPriorDate = moment().subtract(1, 'months').format('YYYY-MM-DD')
      // var isNonPaidLeave = req.body.isNonPaidLeave
      employeeLeaves.findOne({
        where: { empId: req.body.empId }
      }).then(function (leaves) {
        if (!leaves) {
          return res.status(404).send({
            message: 'Employee not found'
          })
        } else {
          if (leaves.earnedLeave == '' && leaveTypeId == 3) {
            return res.status(404).send({
              message: 'You do not have earned leaves'
            })
          } else if (year == currentYear + 2 || year == currentYear + 1 || year == currentYear + 3 || year == currentYear + 4 || year > currentYear || year < currentYear) {
            return res.status(404).send({
              message: 'You cannot choose such a date'
            })
          } else if (toYear == currentYear + 2 || toYear == currentYear + 1 || toYear == currentYear + 3 || toYear == currentYear + 4 || toYear > currentYear || toYear < currentYear) {
            return res.status(404).send({
              message: 'You cannot choose such a date'
            })
          }
          // year % 4 != 0 &&
          else if (year % 4 !== 0 && day == 29 && monthFrom == 2) {
            return res.status(404).send({
              message: year + 'is not a leap year'
            })
          } else if (newfrom < oneMonthPriorDate) {
            return res.status(404).send({
              message: 'Can not add last to last months leaves'
            })
          }
          // && isNonPaidLeave == 0
          else if (leaveTypeId == 1 && leaves.casualLeave < diffDays && isHalfDay == 0) {
            return res.status(404).send({
              message: 'You do not have sufficient casual leaves'
            })
          } else if (leaveTypeId == 2 && leaves.sickLeave < diffDays && isHalfDay == 0) {
            return res.status(404).send({
              message: 'You do not have sufficient sick leaves'
            })
          } else if (leaveTypeId == 3 && leaves.earnedLeave < diffDays && leaves.earnedLeave == 0) {
            return res.status(404).send({
              message: 'You do not have sufficient earned leaves'
            })
          } else if (leaveTypeId == 2 && (!req.file)) {
            return res.status(404).send({
              message: 'Please upload medical certificate'
            })
          } else if (diffDays < 0) {
            return res.status(404).send({
              message: 'toDate cannot be less than fromDate,please enter different todate'
            })
          } else {
            if (isHalfDay == 1) {
              diffDays = 0.5
              var date3 = moment(req.body.fromDate).format('YYYY-MM-DD')
              var date4 = moment(req.body.fromDate).format('YYYY-MM-DD')
            } else {
              var date3 = new Date(req.body.fromDate)
              var date4 = new Date(req.body.toDate)
            }
            if (leaveTypeId == 2 && req.file.path !== '') {
              var sampleFile = req.file.path
            } else {
              var sampleFile = ''
            }
            // if (req.body.nonPaidLeave == 1) {
            //     var nonPaidLeave = req.body.isNonPaidLeave
            // }
            // else {
            //     nonPaidLeave = 0
            // }
            return leave
              .create(
                {
                  'fromDate': date3,
                  'toDate': date4,
                  'reasonofleave': req.body.reasonofleave,
                  'status': req.body.status,
                  'noOfDays': diffDays,
                  'medicalCertPath': sampleFile,
                  'leaveTypeId': req.body.leaveTypeId,
                  'empId': req.body.empId,
                  'isHalfDay': req.body.isHalfDay,
                  'isMorningHalf': req.body.isMorningHalf
                  // 'isNonPaidLeave': nonPaidLeave
                }).then(leave => res.status(201).send(leave))
              .catch(error => res.status(400).send(error))
          }
        }
      })
    }
  },
  update(req, res) {
    var leaveId = req.params.leaveId
    leave.findOne({
      where: {
        id: leaveId,
        empId: req.body.empId
      }
    }).then(function (leaves) {
      console.log(leaves)
      if (leaves != null) {
        if (leaves.status == 1) {
          return res.status(404).send({
            message: 'cannot update leave as it is already approved'
          })
        } else {
          if (req.body.reasonofleave == '') {
            return res.status(404).send({
              message: 'Please specify a reason'
            })``
          } else {
            var isHalfDay = req.body.isHalfDay
            var currentTime = new Date()
            var date1 = new Date(req.body.fromDate)
            var newfrom = moment(req.body.fromDate).format('YYYY-MM-DD')
            var date2 = new Date(req.body.toDate)
            var diffTime = (date2.getTime() - date1.getTime())
            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            var leaveTypeId = req.body.leaveTypeId
            var currentYear = currentTime.getFullYear()
            var monthFrom = date1.getMonth() + 1
            var day = date1.getDate()
            var year = date1.getFullYear()
            var toYear = date2.getFullYear()
            var oneMonthPriorDate = moment().subtract(1, 'months').format('YYYY-MM-DD')
            console.log(oneMonthPriorDate)
            employeeLeaves.findOne({
              where: { empId: req.body.empId }
            }).then(function (leaves) {
              if (!leaves) {
                return res.status(404).send({
                  message: 'Employee not found'
                })
              } else {
                if (leaves.earnedLeave == '' && leaveTypeId == 3) {
                  return res.status(404).send({
                    message: 'You do not have earned leaves'
                  })
                } else if (year == currentYear + 2 || year == currentYear + 1 || year == currentYear + 3 || year == currentYear + 4 || year > currentYear || year < currentYear) {
                  return res.status(404).send({
                    message: 'You cannot choose such a date'
                  })
                } else if (toYear == currentYear + 2 || toYear == currentYear + 1 || toYear == currentYear + 3 || toYear == currentYear + 4 || toYear > currentYear || toYear < currentYear) {
                  return res.status(404).send({
                    message: 'You cannot choose such a date'
                  })
                } else if (year % 4 !== 0 && day == 29 && monthFrom == 2) {
                  return res.status(404).send({
                    message: year + 'is not a leap year'
                  })
                } else if (newfrom < oneMonthPriorDate) {
                  return res.status(404).send({
                    message: 'Can not add last to last months leaves'
                  })
                } else if (leaveTypeId == 1 && leaves.casualLeave < diffDays && isHalfDay == 0) {
                  return res.status(404).send({
                    message: 'You do not have sufficient casual leaves'
                  })
                } else if (leaveTypeId == 2 && leaves.sickLeave < diffDays && isHalfDay == 0) {
                  console.log(leaves.sickLeave)
                  return res.status(404).send({
                    message: 'You do not have sufficient sick leaves'
                  })
                } else if (leaveTypeId == 3 && leaves.earnedLeave < diffDays && leaves.earnedLeave == 0) {
                  return res.status(404).send({
                    message: 'You do not have sufficient earned leaves'
                  })
                } else if (leaveTypeId == 2 && (!req.file)) {
                  return res.status(404).send({
                    message: 'Please upload medical certificate'
                  })
                } else if (diffDays < 0) {
                  return res.status(404).send({
                    message: 'toDate cannot be less than fromDate,please enter different todate'
                  })
                } else {
                  if (isHalfDay == 1) {
                    diffDays = 0.5
                    var date3 = moment(req.body.fromDate).format('YYYY-MM-DD')
                    var date4 = moment(req.body.fromDate).format('YYYY-MM-DD')
                  } else {
                    var date3 = new Date(req.body.fromDate)
                    var date4 = new Date(req.body.toDate)
                  }
                  if (leaveTypeId == 2 && req.file.path !== '') {
                    var sampleFile = req.file.path
                  } else {
                    var sampleFile = ''
                  }
                  // if (req.body.isNonPaidLeave == 1) {
                  //     var nonPaidLeave = req.body.isNonPaidLeave
                  // }
                  // else {
                  //     var nonPaidLeave = 0
                  // }

                  return leave
                    .update(
                      {
                        'fromDate': date3,
                        'toDate': date4,
                        'reasonofleave': req.body.reasonofleave,
                        'status': req.body.status,
                        'noOfDays': diffDays,
                        'medicalCertPath': sampleFile,
                        'leaveTypeId': req.body.leaveTypeId,
                        'empId': req.body.empId,
                        'isHalfDay': req.body.isHalfDay,
                        'isMorningHalf': req.body.isMorningHalf
                        // 'isNonPaidLeave': nonPaidLeave
                      },
                      { where: { id: leaveId } }
                    ).then(() => {
                      res.status(200).send('updated successfully leave with id = ' + leaveId)
                    })
                }
              }
            })
          }
        }
      } else {
        console.log('leaves not found!!!!!!!!')
        return res.status(404).send({
          message: 'leaves not found for employee'
        })
      }
    })
  },
  list(req, res) {
    return leave
      .findAll().then(leave => {
        res.send(leave)
      })
  },
  listUnApprovedLeaves(req, res) {
    employee.findAll({
      include: [{
        model: leave,
        as: 'empLeaves',
        where: { status: 0 }
      }]
    }).then(leave => {
      if (!leave) {
        return res.status(404).send({
          message: 'Leaves not found'
        })
      }
      return res.status(200).send(leave)
    })
      .catch(error => res.status(400).send(error))
  },
  listApprovedLeaves(req, res) {
    test.sequelize.query('CALL getApprovedLeaves()')
      .then(data => {
        if (!data) {
          res.status(404).send({ messsage: 'data not found' })
        } else {
          res.send(data)
        }
      }).catch(error => {
        res.status(400).send(error)
      })
    // employee.findAll({
    //     include: [{
    //         model: leave,
    //         as: 'empLeaves',
    //         where: { status: 1 }
    //     }],
    // }).then(leave => {
    //     if (!leave) {
    //         res.status(404).send({
    //             message: 'Leaves not found',
    //         })
    //     }
    //     return res.status(200).send(leave)
    // })
    //     .catch(error => res.status(400).send(error))
  },
  approveLeaves(req, res) {
    var leaveId = req.body.id
    var empId = req.body.empId
    // if (req.user.empTypeId == 1) {
    //   //allow to approve leave

    // }
    // else {
    //   //if not do not allow
    // }

    leave.findOne({
      where: { status: 0, id: leaveId, empId: empId }
    }).then(function (leaveData) {
      if (leaveData == null) {
        res.status(404).send({
          message: 'Leaves not found'
        })
      } else {
        res.send(leaveData)
        var noOfLeave = leaveData.noOfDays
        var leaveType = leaveData.leaveTypeId
        console.log(leaveType)
        leave.update(
          { status: 1 },
          { where: { id: leaveId, empId: empId } })
        if (leaveType == 1) {
          console.log('inside casual')
          employeeLeaves.update(
            { casualLeave: test.sequelize.literal('casualLeave -' + noOfLeave + '') },
            { where: { empId: empId } }
          )
        } else if (leaveType == 2) {
          console.log('inside sick')
          employeeLeaves.update({ sickLeave: test.sequelize.literal('sickLeave - ' + noOfLeave + '') },
            { where: { empId: empId } }
          )
        } else if (leaveType == 3) {
          console.log('inside earned')
          employeeLeaves.update({ earnedLeave: test.sequelize.literal('earnedLeave - ' + noOfLeave + '') },
            { where: { empId: empId } }
          )
        } else if (leaveType == 4) {
          console.log('inside unpaid leave')
          res.status(201).send({ message: 'unpaid leave approved' })
          // employeeLeaves.update({ earnedLeave: test.sequelize.literal('earnedLeave - ' + noOfLeave + '') },
          //     { where: { empId: empId } }
          // )
        }
      }
    })
  },
  deleteLeave(req, res) {
    const id = req.params.leaveId
    const empId = req.params.empId
    leave.destroy(
      {
        where: { id: id, status: 0, empId: empId }
      }
    ).then(function (data) {
      if (data) {
        res.status(200).send('deleted sucessfully leave with id:' + id)
      } else {
        res.status(404).send({
          message: 'cannot delete approved Leaves'
        })
      }
    })
  },
  calculateEarnedLeaves(req, res) {
    var Id = req.body.empId
    employee.findOne({
      where: { id: Id }
    }).then(function (Emp) {
      if (Emp) {
        const date1 = new Date(Emp.dateofJoining)
        const date2 = new Date()
        const diffTime = Math.abs(date2.getTime() - date1.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        if (diffDays < 365) {
          employeeLeaves.update({
            sickLeave: 7,
            casualLeave: 8,
            earnedLeave: 0,
            empId: employee.id
          }, { where: { id: req.body.empId } }
          ).then(empleaves => res.status(200).send(empleaves))
        } else if (diffDays >= 365 && diffDays < 730) {
          employeeLeaves.update({
            sickLeave: 7,
            casualLeave: 8,
            earnedLeave: 3,
            empId: employee.id
          }, { where: { id: req.body.empId } }
          ).then(empleaves => res.status(200).send(empleaves))
        } else if (diffDays >= 730 && diffDays < 1095) {
          employeeLeaves.update({
            sickLeave: 7,
            casualLeave: 8,
            earnedLeave: 5,
            empId: employee.id
          }, { where: { id: req.body.empId } }
          ).then(empleaves => res.status(200).send(empleaves))
        } else if (diffDays >= 1095) {
          employeeLeaves.update({
            sickLeave: 7,
            casualLeave: 8,
            earnedLeave: 7,
            empId: employee.id
          }, { where: { id: req.body.empId } }
          ).then(empleaves => res.status(200).send(empleaves))
        }
        // console.log(diffDays)
      }
    })
  },
  rejectLeaves(req, res) {
    var leaveId = req.body.id
    var empId = req.body.empId
    leave.findOne({
      where: { status: 0, id: leaveId, empId: empId }
    }).then(function (leaveData) {
      if (leaveData == null) {
        res.status(404).send({
          message: 'Leaves not found'
        })
      } else {
        // res.send(leaveData)
        leave.update(
          { status: 2 },
          { where: { id: leaveId, empId: empId } }
        ).then(() => {
          res.status(200).send('Leave Rejected')
        })
      }
    })
  },
  getRejectedLeaves(req, res) {
    test.sequelize.query('CALL getRejectedLeaves()')
      .then(function (data) {
        if (!data) {
          res.send({ message: 'Rejected leaves not found' })
        } else {
          res.send(data)
        }
      })
  }
}
