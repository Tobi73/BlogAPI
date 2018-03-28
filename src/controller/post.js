import { Router } from 'express';
import * as Post from './../bll/post';
import excCatch from './../tools/catcher';

const app = Router();

app.get('/list', excCatch(async (req, res, next) => {
  const list = await Post.getList(req.query.page, req.query.size);
  return res.json(list);
}));

app.get('/:id', excCatch(async (req, res, next) => {
  const post = await Post.getPost(req.params.id);
  return res.json(post);
}));

app.post('/', excCatch(async (req, res, next) => {
  await Post.addPost(req.body);
  return res.end();
}));

app.delete('/:id', excCatch(async (req, res, next) => {
  await Post.deletePost(req.params.id);
  return res.end();
}));

app.put('/:id', excCatch(async (req, res, next) => {
  await Post.updatePost(req.params.id, req.body);
  return res.end();
}));


export default app;
