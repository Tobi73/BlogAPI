import { Router } from 'express';
import * as Post from './../bll/post';
import excCatch from './../tools/catcher';
import { checkRights } from './../auth';
import { Roles } from './../constants';

const app = Router();
const adminScope = [Roles.admin];
const publicScope = [Roles.admin, Roles.user];

/**
 *
 * @api {get} /api/list PostList
 * @apiName GetPostList
 * @apiGroup Post
 * @apiVersion  1.0.0
 *
 *
 * @apiParam  {Number} page Page number of the list
 * @apiParam  {Number} size Size of the list
 *
 * @apiSuccess (200) {Object} postList Object that contains list of posts
 *
 * @apiParamExample  http://localhost:3002/api/post/list?size=1&page=1
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 *     "posts" : [
 *          {
 *             "text": "some post"
 *          }
 *      ]
 * }
 *
 *
 */
app.get('/list', checkRights(publicScope), excCatch(async (req, res, next) => {
  const list = await Post.getList(req.query.page, req.query.size);
  return res.json(list);
}));

/**
 *
 * @api {get} /api/post GetPost
 * @apiName GetPost
 * @apiGroup Post
 * @apiVersion  1.0.0
 *
 *
 * @apiParam  {String} id _id of the post
 *
 * @apiSuccess (200) {Object} Post Object that contains post info
 *
 * @apiParamExample http://localhost:3002/api/post/507f191e810c19729de860ea
 *
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 *     "text" : "some post text"
 * }
 *
 *
 */
app.get('/:id', checkRights(publicScope), excCatch(async (req, res, next) => {
  const post = await Post.getPost(req.params.id);
  return res.json(post);
}));

/**
 *
 * @api {post} /api/post/ AddPost
 * @apiName AddPost
 * @apiGroup Post
 * @apiVersion  1.0.0
 *
 *
 * @apiParam  {String} text Text of the post
 *
 * @apiParamExample  {json} http://localhost:3002/api/post:
 * {
 *     "text" : "some text for new post"
 * }
 *
 *
 */
app.post('/', checkRights(adminScope), excCatch(async (req, res, next) => {
  await Post.addPost(req.body);
  return res.end();
}));

/**
 *
 * @api {delete} /api/post DeletePost
 * @apiName DeletePost
 * @apiGroup Post
 * @apiVersion  1.0.0
 *
 *
 * @apiParam  {String} id _id of the post
 *
 * @apiSuccessExample http://localhost:3002/api/post/507f191e810c19729de860ea
 *
 *
 */
app.delete('/:id', checkRights(adminScope), excCatch(async (req, res, next) => {
  await Post.deletePost(req.params.id);
  return res.end();
}));

/**
 *
 * @api {put} /api/post EditPost
 * @apiName EditPost
 * @apiGroup Post
 * @apiVersion  1.0.0
 *
 *
 * @apiParam  {String} id _id of the post
 * @apiParam  {String} text Text of the post
 *
 *
 * @apiParamExample  {json} http://localhost:3002/api/post/507f191e810c19729de860ea:
 * {
 *     "text" : "edited text for post"
 * }
 *
 */
app.put('/:id', checkRights(adminScope), excCatch(async (req, res, next) => {
  await Post.updatePost(req.params.id, req.body.text);
  return res.end();
}));


export default app;
