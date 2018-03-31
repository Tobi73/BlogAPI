import { Router } from 'express';
import post from './post';
import user from './user';
import { ensureAuthenticated, authenticate } from './../auth';

const api = Router();
const router = Router();

router.use('/post', ensureAuthenticated, post);
router.use('/auth', user);

api.use('/api', authenticate, router);

export default api;
