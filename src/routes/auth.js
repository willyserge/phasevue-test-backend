import express from 'express';
import AsyncHandler from 'express-async-handler';
import Auth from '../controllers/authController';
import Validate from '../middleware/validator';


const authRouter = express.Router();

authRouter.post('/signup', Validate.signup, AsyncHandler(Auth.signup));
authRouter.post('/signin', Validate.signin, AsyncHandler(Auth.signin));
authRouter.post('/passwordless', AsyncHandler(Auth.identify));
authRouter.post('/passwordless-register', AsyncHandler(Auth.passwordlessRegister));
authRouter.get('/passwordless/verify/:id', AsyncHandler(Auth.verify));
authRouter.post('/client/register', AsyncHandler(Auth.registerNewClient));
authRouter.post('/logout', Auth.logout);
authRouter.get('/token', Auth.checkCookie);

export default authRouter;
