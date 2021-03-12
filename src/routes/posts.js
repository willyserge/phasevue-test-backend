import express from 'express';
import AsyncHandler from 'express-async-handler';

import Posts from '../controllers/postController';
import auth from '../middleware/auth';
import Validate from '../middleware/validator';


const postsRouter = express.Router();


postsRouter.get('/posts', AsyncHandler(Posts.getAllPosts));


export default postsRouter;
