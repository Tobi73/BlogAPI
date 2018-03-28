import { ObjectId } from 'mongodb';
import { Post } from './../model';

export const getPost = async (_id) => {
  const post = await Post.findOne({ _id: new ObjectId(_id) });
  return post;
};

export const getList = async (page, limit) => {
  const pagination = {
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 10,
  };
  const list = await Post.paginate({}, pagination);
  return { posts: list.docs };
};

export const addPost = async (post) => {
  const model = new Post(post);
  await model.save();
};

export const updatePost = async (_id, update) => {
  await Post.replaceOne({ _id: new ObjectId(_id) }, update);
};

export const deletePost = async (_id) => {
  await Post.remove({ _id: new ObjectId(_id) });
};
