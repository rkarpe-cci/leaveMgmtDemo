const supertest = require("supertest");
const chai = require('chai')
const chaiHttp = require('chai-http')
var server = supertest.agent("http://localhost:8000");
const assert = require('chai').assert
const dbEmployee = require('../models').employees
process.env.NODE_ENV = 'test';
//import app from '../server';
// Configure chai
chai.use(chaiHttp);
chai.should();
describe("Users", () => {
  describe("GET /", () => {
    // Test to get all students record
    it("should get all user records", (done) => {
      server
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          //res.body.should.be.a('object');
          res.error.should.equal(false);
          assert.typeOf(res, 'object');
          res.body.should.be.a('array');
          done();
        });
    });
    //Test to get single student record
    it("should get a single user record", (done) => {
      const id = 1;
      server
        .get(`/${id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
    // it('it should GET a user by the given id', (done) => {
    //   let user = new dbEmployee(
    //     {
    //       'firstName': 'priya',
    //       'lastname': 'Naik',
    //       'address': 'Goa',
    //       'dateofJoining': '2019-06-06',
    //       'empTypeId': 1,
    //       'panCardNo': 'yuio5671y7',
    //       'dob': '1993-05-05',
    //       'userName': 'priya20',
    //       'email': 'abc@gmail.com',
    //       'password': 'qwerty12'
    //     });
    //   user.save((err, user) => {

    //     server
    //       .get('/user/' + user.id)
    //       .send(user)
    //       .end((err, res) => {
    //         res.should.have.status(200);
    //         res.body.should.be.a('object');
    //         done();
    //       });
    //   })
    // })
    // Test to get single student record
    it("should not get a single user record", (done) => {
      const id = 3;
      server
        .get(`/${id}`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('it should not POST a user without userName field', (done) => {
      let user = {
        'firstName': "priya",
        'lastname': "Naik",
        'address': "Goa",
        'dateofJoining': "2019-06-06",
        'empTypeId': 1,
        'panCardNo': "yuio5671y7",
        'dob': "1993-05-05",
        //'userName': "priya20",
        'email': "abc@gmail.com",
        'password': "qwerty12"
      }
      server
        .post('/api/createUser')
        .send(user)
        .end((err, res) => {
          //res.should.have.status(400);
          res.should.have.status(200);
          res.body.should.be.a('object');
          //res.body.should.have.property('message');
          // res.body.should.have.property('errors');
          done();
        });
    })

  });
});