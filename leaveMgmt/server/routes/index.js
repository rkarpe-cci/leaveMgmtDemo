const annualHolidayController = require('../controllers/holidayController')
const employeeController = require('../controllers/employeeController')
const leaveController = require('../controllers/leaveController')
const verifySignUp = require('../routes/verifySignUp')

const userAuth = require('../services/userAuthServices')
var multer = require('multer')
var storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg')
  }
})
// file.mimetype==='application/pdf'
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}
// var upload = multer({ dest: 'uploads/' })
const upload = multer({
  storage: storage,
  limits: {
    filesSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})
module.exports = app => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Leave Management System'
  }))
  
  app
    .route('/AnnualHolidays')
    .post(userAuth.authJwt, annualHolidayController.create)
    .get(userAuth.authJwt, annualHolidayController.list)
  app.put('/updateAnnualHolidays/:id', userAuth.authJwt, annualHolidayController.update) // update annual Holidays

  app
    .route('/Employee')
    .post(verifySignUp.checkDuplicateUserNameOrEmail, employeeController.create)
    .get(userAuth.authJwt, employeeController.list)

  app
    .route('/Employee/:empId')
    .put(userAuth.authJwt, employeeController.update)
    .delete(userAuth.authJwt, employeeController.delete)
    .get(userAuth.authJwt, employeeController.findById)

  app
    .route('/leave')
    .delete(userAuth.authJwt, employeeController.delete)
    .get(userAuth.authJwt, employeeController.findById)
    .post(userAuth.authJwt, upload.single('image'), leaveController.create)
    .put(userAuth.authJwt, upload.single('image'), leaveController.update)

  app.route('EmployeeLeavesById/:empId')
    .get(userAuth.authJwt, employeeController.getEmployeeLeavesById)

  app.route('/api/getEmpOnLeaveByDateFilter/:fromDate')
    .get(userAuth.authJwt, employeeController.getEmpOnLeaveByDateFilter)

  app.route('/api/getEmpLeavesByDateRange')
    .post(userAuth.authJwt, employeeController.getEmpLeavesByDateRange)

  app.route('/deleteLeave/:leaveId/:empId')
    .delete(userAuth.authJwt, leaveController.deleteLeave)

  app.route('approveEmployeeLeaves')
  .post(userAuth.authJwt, leaveController.approveLeaves)

  app.route('rejectEmployeeLeave')
    .post(userAuth.authJwt, leaveController.rejectLeaves)
    .get(userAuth.authJwt, leaveController.getRejectedLeaves)

  app.route('listUnApprovedLeaves')
    .get(userAuth.authJwt, leaveController.listUnApprovedLeaves)

  app.route('listApprovedLeaves')
    .get(userAuth.authJwt, leaveController.listApprovedLeaves)

  app.route('rejectEmployeeLeave')
    .post(userAuth.authJwt, leaveController.rejectLeaves)

  // calculating earned leaves
  app.post('/api/calculateEarnedLeavesforEmployee', userAuth.authJwt, leaveController.calculateEarnedLeaves)

  app.route('/EmployeeTypes')
    .post(userAuth.authJwt, employeeController.createEmployeeTypes)
    .get(userAuth.authJwt, employeeController.listEmployeeTypes)

  app.route('/EmployeeTypes/:id')
    .put(userAuth.authJwt, employeeController.updateEmployeeTypes)

  app.route('/leaveTypes')
    .post(userAuth.authJwt, employeeController.createLeaveTypes)

  app.route('/leaveTypes/:id')
    .put(userAuth.authJwt, employeeController.updateLeaveTypes)

  app.route('/signIn')
    .post(userAuth.authLocal, employeeController.logIn)

  //unit testing
  app.get('/', employeeController.list);
  //app.get('/user/:id', userController.getUserById);
  app.get('/:id', employeeController.findById);
  app.post('/api/createUser', employeeController.create)// insert user
  app.delete('/api/delete/:empId', employeeController.delete) // Delete Employee
  app.put('/api/update/:empId', employeeController.update) // update Employee
  app.post('/api/rejectEmployeeLeave',leaveController.rejectLeaves) // Reject Leave
  app.post('/api/ApplyEmployeeLeave',upload.single('image'), leaveController.create)
}

// app.post('/api/createEmployeeTypes', userAuth.authJwt, employeeController.createEmployeeTypes)// creating Employee Types
//   app.post('/api/createLeaveTypes', userAuth.authJwt, employeeController.createLeaveTypes)// creating Leave Types
//   app.put('/api/UpdateLeaveTypes/:id', userAuth.authJwt, employeeController.updateLeaveTypes)// update LeaveTypes
//   app.put('/api/UpdateEmployeeTypes/:id', userAuth.authJwt, employeeController.updateEmployeeTypes)// update LeaveTypes
//   app.get('/api/listEmployeeTypes', userAuth.authJwt, employeeController.listEmployeeTypes)// list EmployeeTypes
//post('/api/signIn', userAuth.authLocal, employeeController.logIn)//  user signIn
//app.post('/api/ApplyEmployeeLeave', userAuth.authJwt, upload.single('image'), leaveController.create) // Apply Leave
  //app.put('/api/updateLeave/:leaveId', userAuth.authJwt, upload.single('image'), leaveController.update) // Update Leave
  //app.get('/api/getEmployeeLeavesById/:empId', userAuth.authJwt, employeeController.getEmployeeLeavesById) // Get Employee Leaves(casual,sick,earned)
  //app.get('/api/getEmpOnLeaveByDateFilter/:fromDate', userAuth.authJwt, employeeController.getEmpOnLeaveByDateFilter)// Get employees om leave on particular date
  //app.post('/api/getEmpLeavesByDateRange', userAuth.authJwt, employeeController.getEmpLeavesByDateRange) // Get employees om leave By date range
  // app.delete('/api/deleteLeave/:leaveId/:empId', userAuth.authJwt, leaveController.deleteLeave) // delete Leave
  // app.get('/api/listUnApprovedLeaves', leaveController.listUnApprovedLeaves) // list Approved Leaves
  // app.get('/api/listApprovedLeaves', leaveController.listApprovedLeaves) // List unapproved leaves
  // app.get('/api/getRejectedLeaves', userAuth.authJwt, leaveController.getRejectedLeaves) // List Rejected leaves
  // app.post('/api/approveEmployeeLeaves', userAuth.authJwt, leaveController.approveLeaves) // approve leaves
  // app.post('/api/rejectEmployeeLeave', userAuth.authJwt, leaveController.rejectLeaves) // Reject Leave
  //app.post('/api/insertAnnualHolidays', userAuth.authJwt, annualHolidayController.create) // insert annual Holidays

 // app.get('/api/getAnnualHolidays', userAuth.authJwt, annualHolidayController.list) // display annual Holidays
  //app.post('/api/insertEmployee', verifySignUp.checkDuplicateUserNameOrEmail, employeeController.create) // create Employee
  //app.get('/api/getEmployees', userAuth.authJwt, employeeController.list) // display Employee
  //app.put('/api/updateEmployee/:empId', userAuth.authJwt, employeeController.update) // update Employee
  //app.delete('/api/deleteEmployee/:empId', userAuth.authJwt, employeeController.delete) // Delete Employee
  //app.get('/api/getEmployeeById/:empId', userAuth.authJwt, employeeController.findById) // Delete Employee By Id