import express from 'express';
import AsyncHandler from 'express-async-handler';

import Phases from '../controllers/phaseCtrl';
import auth from '../middleware/auth';
import Validate from '../middleware/validator';


const phaseRouter = express.Router();


phaseRouter.get('/phases', auth, AsyncHandler(Phases.getAllPhases));
phaseRouter.post('/project/phase/:projectId', auth, AsyncHandler(Phases.createPhase));


export default phaseRouter;
