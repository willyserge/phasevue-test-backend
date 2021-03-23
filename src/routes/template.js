import express from 'express';
import AsyncHandler from 'express-async-handler';

import Templates from '../controllers/templateCtrl';
import auth from '../middleware/auth';
import Validate from '../middleware/validator';


const templatesRouter = express.Router();

templatesRouter.get('/', auth, AsyncHandler(Templates.getTemplates));
templatesRouter.post('/create', auth, AsyncHandler(Templates.createTemplate));

export default templatesRouter;
