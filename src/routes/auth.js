import express from 'express';
import AsyncHandler from 'express-async-handler';
import Auth from '../controllers/authController';
import Validate from '../middleware/validator';


const authRouter = express.Router();

authRouter.post('/signup', Validate.signup, AsyncHandler(Auth.signup));
authRouter.post('/signin', Validate.signin, AsyncHandler(Auth.signin));
authRouter.post('/client/register', AsyncHandler(Auth.registerNewClient));
authRouter.post('/logout', Auth.logout);
authRouter.get('/token', Auth.checkCookie);
export default authRouter;
