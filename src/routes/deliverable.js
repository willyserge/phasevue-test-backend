import express from 'express';
import AsyncHandler from 'express-async-handler';

import Deliverables from '../controllers/deliverablectrl';
import auth from '../middleware/auth';
import Validate from '../middleware/validator';


const deliverableRouter = express.Router();


deliverableRouter.get('/phases', AsyncHandler(Deliverables.getPhaseDeliverables));
deliverableRouter.post('/project/:projectId', AsyncHandler(Deliverables.createDeliverable));


export default deliverableRouter;
