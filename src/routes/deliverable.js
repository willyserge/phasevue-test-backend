import express from 'express';
import AsyncHandler from 'express-async-handler';
import Deliverables from '../controllers/deliverableCtrl';
import auth from '../middleware/auth';
import Validate from '../middleware/validator';

const deliverableRouter = express.Router();

deliverableRouter.post('/phase/deliverables', auth, AsyncHandler(Deliverables.getPhaseDeliverables));
deliverableRouter.post('/deliverable/', auth, AsyncHandler(Deliverables.createDeliverable));
deliverableRouter.put('/deliverable/update', auth, AsyncHandler(Deliverables.updateDeliverable));
deliverableRouter.delete('/deliverable/:deliverableId', auth, AsyncHandler(Deliverables.deleteDeliverable));
deliverableRouter.get('/client/invite/:token', AsyncHandler(Deliverables.grantClientDeliverableAccess));
deliverableRouter.get('/deliverable/reviewRequest/:id', AsyncHandler(Deliverables.verifyReviewRequest));


export default deliverableRouter;
