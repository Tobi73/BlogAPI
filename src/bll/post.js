import { ObjectId } from 'mongodb';
import { Post } from './../model';
import { LogicException } from '../constants';

export const getPost = async (_id) => {
  if (!_id) throw new LogicException('Id is not defined');
  const post = await Post.findOne({ _id: new ObjectId(_id) });
  if (!post) return post;
  return { text: post.text };
};

export const getList = async (page, limit) => {
  const pagination = {
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 10,
  };
  const rawList = await Post.paginate({}, pagination);
  const posts = rawList.docs.map(doc => ({ text: doc.text }));
  return { posts };
};

export const addPost = async (post) => {
  if (!post) throw new LogicException('Post model is not valid');
  if (!post.text) throw new LogicException('Post is empty');
  const model = new Post(post);
  await model.save();
};

export const updatePost = async (_id, text) => {
  if (!_id) throw new LogicException('Id is not defined');
  if (!text) throw new LogicException('Post cannot be ampty');
  await Post.replaceOne({ _id: new ObjectId(_id) }, { $set: { text } });
};

export const deletePost = async (_id) => {
  if (!_id) throw new LogicException('Id is not defined');
  await Post.remove({ _id: new ObjectId(_id) });
};
