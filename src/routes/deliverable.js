import express from 'express';
import AsyncHandler from 'express-async-handler';

import Deliverables from '../controllers/deliverablectrl';
import auth from '../middleware/auth';
import Validate from '../middleware/validator';

const deliverableRouter = express.Router();

deliverableRouter.post('/phase/deliverables', AsyncHandler(Deliverables.getPhaseDeliverables));
deliverableRouter.post('/deliverable/', AsyncHandler(Deliverables.createDeliverable));
deliverableRouter.put('/deliverable/update', AsyncHandler(Deliverables.updateDeliverable));
deliverableRouter.delete('/deliverable/:deliverableId', AsyncHandler(Deliverables.deleteDeliverable));


export default deliverableRouter;
