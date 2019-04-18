const employee = require('../models').employees
checkDuplicateUserNameOrEmail = (req, res, next) => {
  // -> Check Username is already in use
  employee.findOne({
    where: {
      userName: req.body.userName
    } 
  }).then(newUser => {
    if(newUser){
      res.status(400).send("Fail -> Username is already taken!");
      return;
    }
    // -> Check Email is already in use
    employee.findOne({ 
      where: {
        email: req.body.email
      } 
    }).then(userEmail => {
      if(userEmail){
        res.status(400).send("Fail -> Email is already in use!");
        return;
      }
      next();
    });
  });
}
const signUpVerify = {};
signUpVerify.checkDuplicateUserNameOrEmail = checkDuplicateUserNameOrEmail;
module.exports = signUpVerify;