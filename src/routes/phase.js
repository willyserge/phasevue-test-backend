import express from 'express';
import AsyncHandler from 'express-async-handler';

import Phases from '../controllers/phaseCtrl';
import auth from '../middleware/auth';
import Validate from '../middleware/validator';


const phaseRouter = express.Router();


phaseRouter.get('/phases', AsyncHandler(Phases.getAllPhases));
phaseRouter.post('/project/:projectId', AsyncHandler(Phases.createPhase));


export default phaseRouter;
