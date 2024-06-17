const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');
const mongoose = require('mongoose');

chai.should();
chai.use(chaiHttp);

describe('Users', () => {
  before((done) => {
    mongoose.connect('mongodb://localhost/tilt-redux-test', { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.once('open', () => {
      console.log('Connected to test database');
      done();
    });
    db.on('error', console.error.bind(console, 'connection error:'));
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done());
    });
  });

  describe('/POST register', () => {
    it('it should register a new user', (done) => {
      let user = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123"
      };
      chai.request(server)
        .post('/api/users/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.should.have.property('email');
          done();
        });
    });
  });

  describe('/POST login', () => {
    it('it should login a user', (done) => {
      let user = {
        email: "john@example.com",
        password: "password123"
      };
      chai.request(server)
        .post('/api/users/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('email');
          done();
        });
    });
  });
});

describe('Campaigns', () => {
  let userId;
  let campaignId;

  before((done) => {
    chai.request(server)
      .post('/api/users/register')
      .send({ name: "Jane Doe", email: "jane@example.com", password: "password123" })
      .end((err, res) => {
        userId = res.body._id;
        done();
      });
  });

  describe('/POST create', () => {
    it('it should create a new campaign', (done) => {
      let campaign = {
        title: "Community Cleanup",
        description: "Raising funds for a community cleanup event",
        goal: 500,
        tiltPoint: 300,
        createdBy: userId
      };
      chai.request(server)
        .post('/api/campaigns/create')
        .send(campaign)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('title');
          res.body.should.have.property('description');
          campaignId = res.body._id;
          done();
        });
    });
  });

  describe('/POST contribute', () => {
    it('it should contribute to a campaign', (done) => {
      let contribution = {
        campaignId: campaignId,
        userId: userId,
        amount: 50,
        paymentMethodId: "test_payment_method"
      };
      chai.request(server)
        .post('/api/campaigns/contribute')
        .send(contribution)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.campaign.should.have.property('raised');
          done();
        });
    });
  });
});
