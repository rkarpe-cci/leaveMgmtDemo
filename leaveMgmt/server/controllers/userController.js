const user = require('../models').user
var bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config/tokenSecretKey')

module.exports = {
  create(req, res) {
    return user
      .create(
        {
          name: req.body.name,
          userName: req.body.userName,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 8)
        })
      .then(function (newUser) {
        if (newUser) {
          res.send(newUser)
        }
        else {
          res.json({ message: 'proble in creating User' })
        }
      })
      .catch(error => res.status(400).send(error))
  },
  signIn(req, res) {
    console.log("Sign-In");
    user.findOne({
      where: {
        userName: req.body.userName
      }
    }).then(user => {

      if (!user) {
        return res.status(404).send('User Not Found');
      }
      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) {
        return res.status(401).send({ auth: false, accessToken: null, reason: "Invalid Password!" });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });

      res.status(200).send({ auth: true, accessToken: token });
    }).catch(err => {
      res.status(500).send('Error -> ' + err);
    });
  },
  // test(req, res) {
  //   jwt.verify(req.token, 'secretkey', (err, authData) => {
  //     if (err) {
  //       res.json({
  //         message: 'not allowed'
  //       })
  //     }
  //     else {
  //       res.json({
  //         message: 'Post Created',
  //         authData
  //       })
  //     }
  //   });

  // }
  test(req, res) {
        res.json({
          message: 'Post Created'
          //authData
        })
  },
  logIn(req, res, next) {
    res.status(200).json(req.user.toAuthJSON());
    return next();
  },
}
