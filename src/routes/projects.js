import express from 'express';
import AsyncHandler from 'express-async-handler';

import Projects from '../controllers/projectCtrl';
import auth from '../middleware/auth';
import Validate from '../middleware/validator';


const projectsRouter = express.Router();

projectsRouter.get('/projects', auth, AsyncHandler(Projects.getAllProjects));
projectsRouter.post('/projects/create', auth, AsyncHandler(Projects.createProject));

export default projectsRouter;
