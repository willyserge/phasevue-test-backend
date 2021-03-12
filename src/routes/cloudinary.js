import express from 'express';
import AsyncHandler from 'express-async-handler';

import Cloudinary from '../controllers/cloudinaryController';
import auth from '../middleware/auth';

const cloudinaryRoutes = express.Router();

cloudinaryRoutes.post('/upload', auth, AsyncHandler(Cloudinary.upload));
cloudinaryRoutes.delete('/remove', auth, AsyncHandler(Cloudinary.remove));

export default cloudinaryRoutes;
