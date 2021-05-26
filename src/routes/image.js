import express from 'express';
import AsyncHandler from 'express-async-handler';

import Images from '../controllers/imageCtrl';
import auth from '../middleware/auth';
import Validate from '../middleware/validator';


const imageRouter = express.Router();

imageRouter.get('/deliverable/images/:deliverableId', AsyncHandler(Images.getDeliverableImages));
imageRouter.post('/deliverable/image', auth, AsyncHandler(Images.createImages));
imageRouter.put('/deliverable/image/annotate', AsyncHandler(Images.addImageAnnotations));

export default imageRouter;
