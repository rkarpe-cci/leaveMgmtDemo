const jwt = require('jsonwebtoken');
const config = require('../config/tokenSecretKey')

//const User = db.user;
// verifyToken = (req, res, next) => {
//   const bearerHeader = req.headers['authorization'];
//   if (typeof bearerHeader !== 'undefined') {
//     const bearer = bearerHeader.split(' ');
//     const bearerToken = bearer[1]
//     req.token = bearerToken
//     req.userId = res.id
//     next()
//   } else {
//     res.json({
//       message: 'access denied'
//     })
//   }
// }
verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'];
  if (!token) {
    return res.status(403).send({
      auth: false, message: 'No token provided.'
    });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(500).send({
        auth: false,
        message: 'Failed to Authenticate . Error -> ' + err
      });
    }
    req.userId = decoded.id;
    next();
  });
}

const authJwt = {};
authJwt.verifyToken = verifyToken

module.exports = authJwt;