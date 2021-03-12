import express from 'express';
import AsyncHandler from 'express-async-handler';
import UserController from '../controllers/userController';


const userRouter = express.Router();

userRouter.get('/users', AsyncHandler(UserController.getAllUsers));
userRouter.get('/user/:id', AsyncHandler(UserController.userInfo));

export default userRouter;
