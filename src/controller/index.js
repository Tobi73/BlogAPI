import { Router } from 'express';
import post from './post';

const api = Router();
const router = Router();

router.use('/post', post);

api.use('/api', router);

export default api;
