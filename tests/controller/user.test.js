import chai from 'chai';
import casual from 'casual';
import { User } from './../../src/model';
import server from './../../src/app';

const should = chai.should();

describe('/api', () => {
  describe('/auth', () => {
    beforeEach(async () => {
      User.collection.deleteMany({});
    });

    describe('/signup', () => {
      it('should create new user account', async () => {
        const { username, password } = casual;
        const newUser = { username, password };
        const response = await chai.request(server).post('/api/auth/signup').send(newUser);
        response.status.should.be.eql(200);
        const foundUser = await User.collection.findOne({ username });
        foundUser.should.be.a('object');
        foundUser.should.have.property('username');
        foundUser.should.have.property('password');
        foundUser.should.have.property('role');
        foundUser.role.should.be.eql('user');
        foundUser.username.should.be.eql(username);
      });

      it('should not create user due to invalid params (missing password)', async () => {
        const { username } = casual;
        const newUser = { username, password: null };
        const response = await chai.request(server).post('/api/auth/signup').send(newUser);
        response.status.should.be.eql(401);
        const foundUser = await User.collection.findOne({ username });
        should.equal(foundUser, null);
      });

      it('should not create user due to invalid params (missing username)', async () => {
        const { password } = casual;
        const newUser = { password, username: null };
        const response = await chai.request(server).post('/api/auth/signup').send(newUser);
        response.status.should.be.eql(401);
      });
    });

    describe('/login', () => {
      it('should get token for user', async () => {
        const { username, password } = casual;
        const newUser = { username, password };
        await chai.request(server).post('/api/auth/signup').send(newUser);
        const response = await chai.request(server).post('/api/auth/login').send(newUser);
        response.status.should.be.eql(200);
        response.body.should.have.property('token');
        should.not.equal(response.body.token, null);
      });

      it('should not get token for user that does not exists', async () => {
        const { username, password } = casual;
        const newUser = { username, password };
        const response = await chai.request(server).post('/api/auth/login').send(newUser);
        response.status.should.be.eql(401);
      });

      it('should not get token for user due to invalid params', async () => {
        const { password } = casual;
        const newUser = { username: null, password };
        const response = await chai.request(server).post('/api/auth/login').send(newUser);
        response.status.should.be.eql(401);
      });
    });
  });
});
