import { Router } from 'express';
import excCatch from './../tools/catcher';
import { signUp, login } from './../bll/user';

const router = new Router();

/**
 *
 * @api {post} /api/auth/signup SignUp
 * @apiName UserSignUp
 * @apiGroup Auth
 * @apiVersion  1.0.0
 *
 * @apiParam  {String} username Username
 * @apiParam  {String} password Password
 *
 * @apiParamExample  {json} http://localhost:3002/api/auth/signup:
 * {
 *     "username" : "newUser",
 *     "password" : "secretpassword"
 * }
 *
 *
 */
router.post('/signup', excCatch(async (req, res, next) => {
  const { username, password } = req.body;
  await signUp(username, password);
  res.end();
}));

/**
 *
 * @api {post} /api/auth/login Login
 * @apiName UserLogIn
 * @apiGroup Auth
 * @apiVersion  1.0.0
 *
 *
 * @apiParam  {String} username Username
 * @apiParam  {String} password Password
 *
 * @apiSuccess (200) {Object} Token Object that contains JWT-token
 *
 * @apiParamExample  {json} http://localhost:3002/api/auth/login:
 * {
 *     "username" : "username",
 *     "password" : "password"
 * }
 *
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 *     "token" : "some jwt token"
 * }
 *
 *
 */
router.post('/login', excCatch(async (req, res, next) => {
  const { username, password } = req.body;
  const token = await login(username, password);
  res.json({ token });
}));

export default router;
