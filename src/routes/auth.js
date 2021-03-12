import express from 'express';
import AsyncHandler from 'express-async-handler';
import Auth from '../controllers/authController';
import Validate from '../middleware/validator';


const authRouter = express.Router();

authRouter.post('/signup', Validate.signup, AsyncHandler(Auth.signup));
authRouter.post('/signin', Validate.signin, AsyncHandler(Auth.signin));
authRouter.get('/logout', Auth.logout);
export default authRouter;
