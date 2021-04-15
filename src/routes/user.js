import express from 'express';
import AsyncHandler from 'express-async-handler';
import UserController from '../controllers/userController';
import auth from '../middleware/auth';


const userRouter = express.Router();

userRouter.get('/users', AsyncHandler(UserController.getAllUsers));
userRouter.get('/user/user_info', auth, AsyncHandler(UserController.userInfo));
userRouter.post('/user/project/invite', auth, AsyncHandler(UserController.projectInvite));

export default userRouter;
