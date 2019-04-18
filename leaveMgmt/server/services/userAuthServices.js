const passport = require('passport')
const LocalStrategy = require("passport-local").Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const JWTStrategy = require('passport-jwt').Strategy
const constants = require('../utils/constants')
//const user = require('../models').user
const employees = require('../models').employees
// const passportJwt = require('passport-jwt')
// const ExtractJwt =passportJwt.ExtractJwt
// const JWTStrategy = passportJwt.Strategy

const localOpts = {
  usernameField: 'userName',
}
const localLogin = new LocalStrategy(localOpts, async (userName, password, done) => {
  try {
    const employee = await employees.findOne({ where: { userName: userName } })

    if (!employee) {
      return done(constants.USER_ERROR_MESSAGE, false)
    } else if (!employee.validPassword(password)) {
      return done(constants.PASSWORD_ERROR_MESSAGE, false)
    }
    //console.log(employee)
    return done(null, employee)
  } catch (error) {
    return done(error, false)
  }
})
const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: constants.JWT_SECRET,
}
const jwtLogin = new JWTStrategy(jwtOpts, async (payload, done) => {
  try {
    const emp = await employees.findByPk(payload.id)
    if (!emp) {
      return done(null, emp)
    }
    return done(null, emp)
  } catch (error) {
    return done(error, false)
  }
})
passport.use(localLogin)
passport.use(jwtLogin)
const authLocal = passport.authenticate('local', { session: false })
const authJwt = passport.authenticate('jwt', { session: false });
module.exports = {
  authLocal,
  authJwt
}