import express from 'express';
import AsyncHandler from 'express-async-handler';

import Projects from '../controllers/projectCtrl';
import auth from '../middleware/auth';
import Validate from '../middleware/validator';


const projectsRouter = express.Router();

projectsRouter.get('/projects', auth, AsyncHandler(Projects.getAllProjects));
projectsRouter.get('/project/:projectId', auth, AsyncHandler(Projects.getOneProject));
projectsRouter.post('/projects/create', auth, AsyncHandler(Projects.createProject));
projectsRouter.put('/projects/update', auth, AsyncHandler(Projects.updateProject));
projectsRouter.delete('/project/:projectId', auth, AsyncHandler(Projects.deleteProject));
projectsRouter.get('/project/invite/:token', auth, AsyncHandler(Projects.addUserToProject));
projectsRouter.put('/projects/addClient', auth, AsyncHandler(Projects.addClient));
projectsRouter.get('/project/clients/:projectId', auth, AsyncHandler(Projects.getProjectClients));
projectsRouter.post('/project/invite-collaborator', auth, AsyncHandler(Projects.inviteCollaborator));

export default projectsRouter;
