import chai from 'chai';
import casual from 'casual';
import { Types } from 'mongoose';
import { Post, User } from './../../src/model';
import server from './../../src/app';
import { signUp } from './../../src/bll/user';
import { Roles } from '../../src/constants';

const should = chai.should();
let userToken = null;
let adminToken = null;

describe('/api', () => {
  describe('/post', () => {
    before(async () => {
      await User.collection.deleteMany({});
      const user = { username: 'test-user', password: 'password' };
      const admin = { username: 'test-admin', password: 'password' };
      await signUp(user.username, user.password);
      await signUp(admin.username, admin.password, Roles.admin);
      const userAuthResult = await chai.request(server)
        .post('/api/auth/login')
        .send(user);
      const adminAuthResult = await chai.request(server)
        .post('/api/auth/login')
        .send(admin);
      adminToken = adminAuthResult.body.token;
      userToken = userAuthResult.body.token;
    });

    afterEach(async () => {
      await Post.collection.deleteMany({});
    });

    describe('GET', () => {
      it('should get single existing post with admin account', async () => {
        const id = new Types.ObjectId();
        const text = casual.sentence;
        const testDoc = {
          _id: id,
          text,
        };
        await Post.collection.insertOne(testDoc);
        const response = await chai.request(server)
          .get(`/api/post/${id.toString()}`)
          .set('Authorization', `Bearer ${adminToken}`);
        response.status.should.be.eq(200);
        response.body.should.be.a('object');
        response.body.should.have.property('text');
        response.body.text.should.be.eql(text);
      });

      it('should get single existing post with user account', async () => {
        const id = new Types.ObjectId();
        const text = casual.sentence;
        const testDoc = {
          _id: id,
          text,
        };
        await Post.collection.insertOne(testDoc);
        const response = await chai.request(server)
          .get(`/api/post/${id.toString()}`)
          .set('Authorization', `Bearer ${userToken}`);
        response.status.should.be.eq(200);
        response.body.should.be.a('object');
        response.body.should.have.property('text');
        response.body.text.should.be.eql(text);
      });

      it('should return null for missing post', async () => {
        const id = new Types.ObjectId();
        const response = await chai.request(server)
          .get(`/api/post/${id}`)
          .set('Authorization', `Bearer ${adminToken}`);
        response.status.should.be.eq(200);
        should.equal(response.body, null);
      });

      it('should return object with list of posts', async () => {
        const testDocs = [];
        for (let i = 0; i < 100; i += 1) {
          testDocs.push({ text: casual.sentence });
        }
        await Post.collection.insertMany(testDocs);
        const response = await chai.request(server)
          .get('/api/post/list')
          .set('Authorization', `Bearer ${adminToken}`);
        response.status.should.be.eq(200);
        response.body.should.be.a('object');
        response.body.should.have.property('posts');
        response.body.posts.should.be.a('array');
        response.body.posts.should.have.length(10);
      });

      it('should return object with list of specified length', async () => {
        const testDocs = [];
        for (let i = 0; i < 100; i += 1) {
          testDocs.push({ text: casual.sentence });
        }
        await Post.collection.insertMany(testDocs);
        const response = await chai.request(server)
          .get('/api/post/list?size=50')
          .set('Authorization', `Bearer ${adminToken}`);
        response.status.should.be.eq(200);
        response.body.should.be.a('object');
        response.body.should.have.property('posts');
        response.body.posts.should.be.a('array');
        response.body.posts.should.have.length(50);
      });

      it('should return object with empty list', async () => {
        const testDocs = [];
        for (let i = 0; i < 100; i += 1) {
          testDocs.push({ text: casual.sentence });
        }
        await Post.collection.insertMany(testDocs);
        const response = await chai.request(server)
          .get('/api/post/list?size=100&page=3')
          .set('Authorization', `Bearer ${adminToken}`);
        response.status.should.be.eq(200);
        response.body.should.be.a('object');
        response.body.should.have.property('posts');
        response.body.posts.should.be.a('array');
        response.body.posts.should.have.length(0);
      });
    });

    describe('POST', () => {
      it('should create single post', async () => {
        const text = casual.sentence;
        const testPost = { text };
        const response = await chai.request(server).post('/api/post')
          .send(testPost)
          .set('Authorization', `Bearer ${adminToken}`);
        const post = await Post.collection.findOne({ text });
        response.status.should.be.eq(200);
        post.should.be.a('object');
        post.should.have.property('text');
      });

      it('should not create post due to lack of access', async () => {
        const text = casual.sentence;
        const testPost = { text };
        const response = await chai.request(server).post('/api/post')
          .send(testPost)
          .set('Authorization', `Bearer ${userToken}`);
        response.status.should.be.eq(403);
      });

      it('should throw error because of invalid model', async () => {
        const text = casual.sentence;
        const testPost = { incorrectField: text };
        const response = await chai.request(server).post('/api/post')
          .send(testPost)
          .set('Authorization', `Bearer ${adminToken}`);
        response.status.should.be.eq(401);
      });
    });

    describe('PUT', () => {
      it('should update existing post', async () => {
        const id = new Types.ObjectId();
        const initialText = casual.sentence;
        const updatedText = casual.sentence;
        const testDoc = {
          _id: id,
          text: initialText,
        };
        const update = {
          text: updatedText,
        };
        await Post.collection.insertOne(testDoc);
        const response = await chai.request(server)
          .put(`/api/post/${id.toString()}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(update);
        const updated = await Post.collection.findOne({ _id: id });
        response.status.should.be.eq(200);
        updated.text.should.be.eq(updatedText);
      });

      it('should not update anything due to lack of access', async () => {
        const id = new Types.ObjectId();
        const initialText = casual.sentence;
        const updatedText = casual.sentence;
        const testDoc = {
          _id: id,
          text: initialText,
        };
        const update = {
          text: updatedText,
        };
        await Post.collection.insertOne(testDoc);
        const response = await chai.request(server)
          .put(`/api/post/${id.toString()}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(update);
        response.status.should.be.eq(403);
      });

      it('should not update anything because post does not exist', async () => {
        const id = new Types.ObjectId();
        const updatedText = casual.sentence;
        const update = {
          text: updatedText,
        };
        const response = await chai.request(server)
          .put(`/api/post/${id.toString()}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(update);
        const updated = await Post.collection.findOne({ _id: id });
        response.status.should.be.eq(200);
        should.equal(updated, null);
      });
    });

    describe('DELETE', () => {
      it('should delete existing post', async () => {
        const id = new Types.ObjectId();
        const testDoc = {
          _id: id,
          text: casual.sentence,
        };
        await Post.collection.insertOne(testDoc);
        const response = await chai.request(server)
          .delete(`/api/post/${id.toString()}`)
          .set('Authorization', `Bearer ${adminToken}`);
        const deleted = await Post.collection.findOne({ _id: id });
        response.status.should.be.eq(200);
        should.equal(deleted, null);
      });

      it('should not delete anything due to lack of access', async () => {
        const id = new Types.ObjectId();
        const testDoc = {
          _id: id,
          text: casual.sentence,
        };
        await Post.collection.insertOne(testDoc);
        const response = await chai.request(server)
          .delete(`/api/post/${id.toString()}`)
          .set('Authorization', `Bearer ${userToken}`);
        response.status.should.be.eq(403);
      });

      it('should not do anything because post does not exist', async () => {
        const id = new Types.ObjectId();
        const response = await chai.request(server)
          .delete(`/api/post/${id.toString()}`)
          .set('Authorization', `Bearer ${adminToken}`);
        const deleted = await Post.collection.findOne({ _id: id });
        response.status.should.be.eq(200);
        should.equal(deleted, null);
      });
    });
  });
});
