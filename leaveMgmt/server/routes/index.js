const annualHolidayController = require('../controllers/holidayController')
const employeeController = require('../controllers/employeeController')
const leaveController = require('../controllers/leaveController')
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
});
//file.mimetype==='application/pdf'
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}
//var upload = multer({ dest: 'uploads/' });
const upload = multer({
    storage: storage, limits: {
        filesSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
module.exports = app => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the Leave Management System',
    }));
    app.post('/api/insertAnnualHolidays', annualHolidayController.create);//insert annual Holidays
    app.put('/api/updateAnnualHolidays/:id', annualHolidayController.update);//update annual Holidays
    app.get('/api/getAnnualHolidays', annualHolidayController.list);//display annual Holidays

    app.post('/api/insertEmployee', employeeController.create);//create Employee
    app.get('/api/getEmployees', employeeController.list);//display Employee
    app.put('/api/updateEmployee/:empId', employeeController.update);//update Employee
    app.delete('/api/deleteEmployee/:empId', employeeController.delete);//Delete Employee
    app.get('/api/getEmployeeById/:empId', employeeController.findById);//Delete Employee By Id
    app.get('/api/getEmployeeLeavesById/:empId', employeeController.getEmployeeLeavesById); //Get Employee Leaves(casual,sick,earned)
    app.get('/api/getEmpOnLeaveByDateFilter/:fromDate', employeeController.getEmpOnLeaveByDateFilter);//Get employees om leave on particular date
    app.post('/api/getEmpLeavesByDateRange', employeeController.getEmpLeavesByDateRange);//Get employees om leave By date range

   
    app.post('/api/ApplyEmployeeLeave', upload.single('image'), leaveController.create);//Apply Leave
    app.put('/api/updateLeave/:leaveId', upload.single('image'), leaveController.update);// Update Leave 
    app.delete('/api/deleteLeave/:leaveId/:empId', leaveController.deleteLeave);//delete Leave

   
    app.get('/api/listUnApprovedLeaves', leaveController.listUnApprovedLeaves);//list Approved Leaves
    app.get('/api/listApprovedLeaves', leaveController.listApprovedLeaves);//List unapproved leaves

    app.post('/api/approveEmployeeLeaves', leaveController.approveLeaves);// approve leaves
    //calculating earned leaves
    app.post('/api/calculateEarnedLeavesforEmployee', leaveController.calculateEarnedLeaves);

    app.post('/api/createEmployeeTypes', employeeController.createEmployeeTypes);//creating Employee Types
    app.post('/api/createLeaveTypes', employeeController.createLeaveTypes);//creating Leave Types
    app.put('/api/UpdateLeaveTypes/:id', employeeController.updateLeaveTypes);
    app.put('/api/UpdateEmployeeTypes/:id', employeeController.updateEmployeeTypes);
    app.get('/api/listEmployeeTypes', employeeController.listEmployeeTypes);
};