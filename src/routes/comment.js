import express from 'express';
import AsyncHandler from 'express-async-handler';

import Comments from '../controllers/commentCtrl';
import auth from '../middleware/auth';
import Validate from '../middleware/validator';


const commentRouter = express.Router();


commentRouter.get('/deliverable/comments/:deliverableId', auth, AsyncHandler(Comments.getDeliverableComments));
commentRouter.post('/deliverable/comment', auth, AsyncHandler(Comments.createComments));
commentRouter.delete('/comment/:commentId', auth, AsyncHandler(Comments.deleteComment));


export default commentRouter;
