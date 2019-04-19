const supertest = require("supertest");
const chai = require('chai')
const chaiHttp = require('chai-http')
var server = supertest.agent("http://localhost:8000");
const assert = require('chai').assert
const dbEmployee = require('../models').employees
process.env.NODE_ENV = 'test';
chai.use(chaiHttp);
chai.should();
describe("Users", () => {
  describe("GET /", () => {
    it("should get all Employee records", (done) => {
      server
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.error.should.equal(false);
          assert.typeOf(res, 'object');
          res.body.should.be.a('array');
          done();
        });
    });
    it("should get a single Employee record", (done) => {
      const id = 2;
      server
        .get(`/${id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
    it("should not get Employee record", (done) => {
      const id = 50;
      server
        .get(`/${id}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message').eql('employee not found');
          done();
        })
    });
    it('it should not POST Employee without userName field', (done) => {
      let user = {
        'firstName': "priya",
        'lastname': "Naik",
        'address': "Goa",
        'dateofJoining': "2019-06-06",
        'empTypeId': 1,
        'panCardNo': "yuio5671y7",
        'dob': "1993-05-05",
        'userName': "",
        'email': "abc@gmail.com",
        'password': "qwerty12"
      }
      server
        .post('/api/createUser')
        .send(user)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          done();
        })
    })
    it('it should  POST Employee ', (done) => {
      let user = {
        'firstName': "Aishwarya",
        'lastname': "Parab",
        'address': "Vasco",
        'dateofJoining': "2019-06-06",
        'empTypeId': 1,
        'panCardNo': "yuio5671y7",
        'dob': "1993-05-05",
        'userName': "aish",
        'email': "abc@gmail.com",
        'password': "$2a$08$Jf41.O929lxdqBNMN8XnEu5MabE9CefuuKbypGSmaTCX1xYKaqqzK"
      }
      server
        .post('/api/createUser')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        })
    })
    // it("should delete single employee record", (done) => {
    //   const empId = 26;
    //   server
    //     .delete('/api/delete/' + empId)
    //     .end((err, res) => {
    //       res.should.have.status(200);
    //       res.body.should.be.a('object');
    //       res.body.should.have.property('message').eql('deleted sucessfully employee');
    //       done();
    //     });
    // });
    it("should not delete single employee record", (done) => {
      const empId = 30;
      server
        .delete('/api/delete/' + empId)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message').eql('employee not found');
          done();
        });
    });
    it("should update single employee record", (done) => {
      const empId = 6;
      server
        .put('/api/update/' + empId)
        .send({
          'firstName': 'meena',
          'lastname': 'Gonsalves',
          'address': 'Tamil Nadu',
          'dateofJoining': '2019-06-06',
          'empTypeId': 1,
          'panCardNo': 'yuio5671y7',
          'dob': '1993-05-05',
          'userName': 'priya20',
          'email': 'abc@gmail.com',
          'password': 'qwerty12'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('updated successfully employee with id=6');
          done();
        });
    });
    it("should not update single employee record", (done) => {
      const empId = 30;
      server
        .put('/api/update/' + empId)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message').eql('employee not found');
          done();
        });
    });
    it("should not reject approved leaves", (done) => {
      const leave = {
        "id": 1,
        "empId": 2
      }
      server
        .post('/api/rejectEmployeeLeave')
        .send(leave)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message').eql('Leaves not found');
          done();
        });
    });
    it("should not create leave if leavetypeid is 2 and medical certificate is not provided", (done) => {
      const leave = {
        'fromDate': '2019-04-20',
        'toDate': '2019-04-20',
        'reasonofleave': 'mild fever',
        'status': 0,
        'noOfDays': 1,
        'medicalCertPath': "",
        'leaveTypeId': 2,
        'empId': 2,
        'isHalfDay': 0,
        'isMorningHalf': 0,
        'isUnpaiPaidLeave': 0
      }
      server
        .post('/api/ApplyEmployeeLeave')
        .send(leave)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message').eql('Please upload medical certificate');
          done();
        });
    });

    it("should create leave if everything is provided", (done) => {
      const leave = {
        'fromDate': '2019-04-20',
        'toDate': '2019-04-20',
        'reasonofleave': 'friends birthday',
        'status': 0,
        'noOfDays': 1,
        'medicalCertPath': "",
        'leaveTypeId': 1,
        'empId': 4,
        'isHalfDay': 0,
        'isMorningHalf': 0,
        'isUnpaiPaidLeave': 0
      }
      server
        .post('/api/ApplyEmployeeLeave')
        .send(leave)
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });

    it("should reject if leave is unapproved", (done) => {
      const leave = {
        "id": 15,
        "empId": 4
      }
      server
        .post('/api/rejectEmployeeLeave')
        .send(leave)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('Leave Rejected');
          done();
        });
    });

    it("should not create leave if you do not have sufficient casual leaves", (done) => {
      const leave = {
        'fromDate': '2019-04-20',
        'toDate': '2019-04-22',
        'reasonofleave': 'going for trekking',
        'status': 0,
        'noOfDays': 1,
        'medicalCertPath': "",
        'leaveTypeId': 1,
        'empId': 2,
        'isHalfDay': 0,
        'isMorningHalf': 0,
        'isUnpaiPaidLeave': 0
      }
      server
        .post('/api/ApplyEmployeeLeave')
        .send(leave)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message').eql('You do not have sufficient casual leaves');
          done();
        });
    });
    it("should not create leave if you do not have sufficient sick leaves", (done) => {
      const leave = {
        'fromDate': '2019-04-20',
        'toDate': '2019-04-30',
        'reasonofleave': 'mild fever',
        'status': 0,
        'noOfDays': 1,
        'medicalCertPath': "fghh.jpg",
        'leaveTypeId': 2,
        'empId': 2,
        'isHalfDay': 0,
        'isMorningHalf': 0,
        'isUnpaiPaidLeave': 0
      }
      server
        .post('/api/ApplyEmployeeLeave')
        .send(leave)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message').eql('You do not have sufficient sick leaves');
          done();
        });
    });
    it("should not create leave if you do not have sufficient earned leaves", (done) => {
      const leave = {
        'fromDate': '2019-04-20',
        'toDate': '2019-04-30',
        'reasonofleave': 'family function',
        'status': 0,
        'noOfDays': 1,
        'medicalCertPath': "fghh.jpg",
        'leaveTypeId': 3,
        'empId': 2,
        'isHalfDay': 0,
        'isMorningHalf': 0,
        'isUnpaiPaidLeave': 0
      }
      server
        .post('/api/ApplyEmployeeLeave')
        .send(leave)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message').eql('You do not have earned leaves');
          done();
        });
    });
    it("should not create leave if from_date is greater than to_date", (done) => {
      const leave = {
        'fromDate': '2019-04-22',
        'toDate': '2019-04-20',
        'reasonofleave': 'family function',
        'status': 0,
        'noOfDays': 1,
        'medicalCertPath': "fghh.jpg",
        'leaveTypeId': 3,
        'empId': 2,
        'isHalfDay': 0,
        'isMorningHalf': 0,
        'isUnpaiPaidLeave': 0
      }
      server
        .post('/api/ApplyEmployeeLeave')
        .send(leave)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message').eql('You do not have earned leaves');
          done();
        });
    });

  });
});