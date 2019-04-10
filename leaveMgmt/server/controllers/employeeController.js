const employee = require('../models').employees
const employeeLeaves = require('../models').empLeaves
const leave = require('../models').leaves
const leaveTypes = require('../models').leavetypes
const employeeTypes = require('../models').empTypes
const test = require('../models/index')
const Sequelize = require('Sequelize');
const Op = Sequelize.Op;
const moment = require('moment');
module.exports = {
    create(req, res) {
        var joiningDate = new Date(req.body.dateofJoining);
        //var testDate = new Date();
        var joiningDate = moment(joiningDate).format('YYYY-MM-DD');
        const currentDate = new Date();
        var panCardNo = req.body.panCardNo;
        if (panCardNo.length > 10 || panCardNo.length < 10) {
            return res.status(404).send({
                message: 'pan Card number cannot be grater than 10 digits',
            });
        }
        else {
            employee.create(
                {
                    "firstName": req.body.firstName,
                    "lastname": req.body.lastname,
                    "address": req.body.address,
                    "dateofJoining": joiningDate,
                    "empTypeId": req.body.empTypeId,
                    "panCardNo": req.body.panCardNo,
                    "dob": req.body.dob
                }
            ).then(function (employee) {
                const date1 = new Date(employee.dateofJoining);
                const diffTime = Math.abs(currentDate.getTime() - date1.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                console.log(diffDays);
                if (diffDays < 365) {
                    employeeLeaves.create({
                        sickLeave: 7,
                        casualLeave: 8,
                        earnedLeave: 0,
                        empId: employee.id
                    }).then(empleaves => res.status(200).send(empleaves))
                }
                else if (diffDays >= 365 && diffDays < 730) {
                    employeeLeaves.create({
                        sickLeave: 7,
                        casualLeave: 8,
                        earnedLeave: 3,
                        empId: employee.id
                    }).then(empleaves => res.status(200).send(empleaves))
                }
                else if (diffDays >= 730 && diffDays < 1095) {
                    employeeLeaves.create({
                        sickLeave: 7,
                        casualLeave: 8,
                        earnedLeave: 5,
                        empId: employee.id
                    }).then(empleaves => res.status(200).send(empleaves))
                }
                else if (diffDays >= 1095) {
                    employeeLeaves.create({
                        sickLeave: 7,
                        casualLeave: 8,
                        earnedLeave: 7,
                        empId: employee.id
                    }).then(empleaves => res.status(200).send(empleaves))
                }
            }).catch(function (e) {
                console.log(e);
            })
        }
    },
    list(req, res) {
        return employee
            .findAll().then(employee => {
                res.send(employee);
            });
    },
    update(req, res) {
        const id = req.params.empId;
        console.log('hhhhj');
        employee.update({ firstName: req.body.firstName, lastName: req.body.lastName, address: req.body.address, dateofJoining: req.body.dateofJoining, empTypeId: req.body.empTypeId, panCardNo: req.body.panCardNo, dob: req.body.dob },
            { where: { id: req.params.empId } }
        ).then(() => {
            res.status(200).send("updated successfully employee with id = " + id);
        });
    },
    delete(req, res) {
        const id = req.params.empId;
        employee.destroy(
            {
                where: { id: id }
            }
        ).then(function (data) {
            if (data) {
                res.status(200).send('deleted sucessfully employee with:' + id);
            }
            else {
                res.status(404).send({ message: 'employee not deleted', });

            }

        });
    },
    findById(req, res) {
        // var id = req.params.empId;
        // test.sequelize.query("call findEmployeeById()", function (err, result) {
        //     if (err) {
        //         res.send(err);
        //     } else {
        //         res.send(result);
        //     }

        // });
        //
        employee.findByPk(req.params.empId).then(employee => {
            if (!employee) {
                return res.status(404).send({
                    message: 'Employee not found',
                });
            }
            else {
                res.send(employee);
            }
        })
    },
    getEmployeeLeavesById(req, res) {
        employee.findOne({
            where: { id: req.params.empId },
            include: [{
                model: employeeLeaves,
                as: 'eachEmpLeaves',

            }],
        }).then(leave => {
            if (!leave) {
                return res.status(404).send({
                    message: 'Leaves not found',
                });
            }
            return res.status(200).send(leave);
        })
            .catch(error => res.status(400).send(error));
    },
    getEmpOnLeaveByDateFilter(req, res) {
        var date1 = new Date(req.params.fromDate);
        console.log(date1);
        return employee
            .findAll({
                include: [{
                    model: leave,
                    as: 'empLeaves',
                    where: {
                        fromDate: date1
                    },
                }],
            }).then(leave => {
                if (!leave) {
                    return res.status(404).send({
                        message: 'Leaves not found',
                    });
                }
                else {
                    res.send(leave);
                }
            });
    },
    getEmpLeavesByDateRange(req, res) {
        var ufromDate = new Date(req.body.fromDate);
        console.log(ufromDate);
        var toDate = new Date(req.body.toDate);
        console.log(toDate);
        return employee
            .findAll({
                include: [{
                    model: leave,
                    as: 'empLeaves',
                    where: { [Op.and]: [{ fromDate: { [Op.between]: [ufromDate, toDate] } }, { status: { [Op.eq]: 1 } }] },
                    // where: { [Op.and]: [{ fromDate: { [Op.between]: [ufromDate, toDate] } }, { toDate: { [Op.between]: [ufromDate, toDate] } }, { status: { [Op.eq]: 1 } }] },
                }],
            }).then(leave => {
                if (!leave) {
                    return res.status(404).send({
                        message: 'Leaves not found',
                    });
                }
                else {
                    res.send(leave);
                }
            });
    },
    createLeaveTypes(req, res) {
        leaveTypes.create({
            leaveTypeName: req.body.leaveTypeName,
            noOfLeaves: req.body.noOfLeaves
        }).then(() => {
            res.status(200).send(" successfully added new leaveType");
        });
    },
    createEmployeeTypes(req, res) {
        employeeTypes.create({
            empTypeName: req.body.empTypeName
        }).then(() => {
            res.status(200).send(" successfully added new Employee Type");
        });
    },
    updateLeaveTypes(req, res) {
        const id = req.params.id;
        leaveTypes.update({ leaveTypeName: req.body.leaveTypeName, noOfLeaves: req.body.noOfLeaves },
            { where: { id: id } }
        ).then(() => {
            res.status(200).send("updated successfully leave Type with id = " + id);
        });
    },
    updateEmployeeTypes(req, res) {
        const id = req.params.id;
        employeeTypes.update({ empTypeName: req.body.empTypeName },
            { where: { id: id } }
        ).then(() => {
            res.status(200).send("updated successfully Employee Type with id = " + id);
        });
    },
    listEmployeeTypes(req, res) {
        employeeTypes.findAll().then(employeeTypes => {
            res.send(employeeTypes);
        });
    },
    listLeaveTypes(req, res) {
        leaveTypes.findAll().then(leaveTypes => {
            res.send(leaveTypes);
        });
    },

};







