import chai from 'chai';
import casual from 'casual';
import { ObjectId } from 'mongodb';
import { Post } from './../../src/model';
import server from './../../src/app';

const should = chai.should();

describe('/api', () => {
  describe('/post', () => {
    afterEach(async () => {
      await Post.collection.deleteMany({});
    });

    describe('GET', () => {
      it('should get single existing post', async () => {
        const id = new ObjectId();
        const testDoc = {
          _id: id,
          text: casual.sentence,
        };
        await Post.collection.insertOne(testDoc);
        const response = await chai.request(server).get(`/api/post/${id.toString()}`);
        response.status.should.be.eq(200);
        response.body.should.be.a('object');
        response.body.should.have.property('text');
        response.body.should.have.property('_id');
        response.body._id.should.be.eq(id.toString());
      });

      it('should return null for missing post', async () => {
        const id = new ObjectId();
        const response = await chai.request(server).get(`/api/post/${id}`);
        response.status.should.be.eq(200);
        should.equal(response.body, null);
      });

      it('should return object with list of posts', async () => {
        const testDocs = [];
        for (let i = 0; i < 100; i += 1) {
          testDocs.push({ text: casual.sentence });
        }
        await Post.collection.insertMany(testDocs);
        const response = await chai.request(server).get('/api/post/list');
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
        const response = await chai.request(server).get('/api/post/list?size=50');
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
        const response = await chai.request(server).get('/api/post/list?size=100&page=3');
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
        const response = await chai.request(server).post('/api/post').send(testPost);
        const post = await Post.collection.findOne({ text });
        response.status.should.be.eq(200);
        post.should.be.a('object');
        post.should.have.property('text');
      });
    });

    describe('PUT', () => {
      it('should update existing post', async () => {
        const id = new ObjectId();
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
          .send(update);
        const updated = await Post.collection.findOne({ _id: id });
        response.status.should.be.eq(200);
        updated.text.should.be.eq(updatedText);
      });

      it('should not update anything because post does not exist', async () => {
        const id = new ObjectId();
        const updatedText = casual.sentence;
        const update = {
          text: updatedText,
        };
        const response = await chai.request(server)
          .put(`/api/post/${id.toString()}`)
          .send(update);
        const updated = await Post.collection.findOne({ _id: id });
        response.status.should.be.eq(200);
        should.equal(updated, null);
      });
    });

    describe('DELETE', () => {
      it('should delete existing post', async () => {
        const id = new ObjectId();
        const testDoc = {
          _id: id,
          text: casual.sentence,
        };
        await Post.collection.insertOne(testDoc);
        const response = await chai.request(server).delete(`/api/post/${id.toString()}`);
        const deleted = await Post.collection.findOne({ _id: id });
        response.status.should.be.eq(200);
        should.equal(deleted, null);
      });

      it('should not do anything because post does not exist', async () => {
        const id = new ObjectId();
        const response = await chai.request(server).delete(`/api/post/${id.toString()}`);
        const deleted = await Post.collection.findOne({ _id: id });
        response.status.should.be.eq(200);
        should.equal(deleted, null);
      });
    });
  });
});
