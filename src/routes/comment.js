import express from 'express';
import AsyncHandler from 'express-async-handler';

import Comments from '../controllers/commentCtrl';
import auth from '../middleware/auth';
import Validate from '../middleware/validator';


const commentRouter = express.Router();


commentRouter.get('/deliverable/comments', AsyncHandler(Comments.getDeliverableComments));
commentRouter.post('/deliverable/comment', auth, AsyncHandler(Comments.createComments));


export default commentRouter;
