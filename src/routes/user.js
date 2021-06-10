import express from 'express';
import AsyncHandler from 'express-async-handler';
import UserController from '../controllers/userController';
import auth from '../middleware/auth';


const userRouter = express.Router();

userRouter.get('/users', auth, AsyncHandler(UserController.getAllUsers));
userRouter.get('/user/user_info', auth, AsyncHandler(UserController.userInfo));
userRouter.put('/user/profilePicture/update', auth, AsyncHandler(UserController.updateProfilePicture));
userRouter.post('/user/password_reset_email', AsyncHandler(UserController.sendResetEmail));
userRouter.get('/token/verify/:token', AsyncHandler(UserController.verifyResetToken));
userRouter.put('/user/password_reset', AsyncHandler(UserController.resetPassword));
userRouter.post('/user/project/invite', auth, AsyncHandler(UserController.projectInvite));
userRouter.post('/user/client/invite', auth, AsyncHandler(UserController.clientInvite));
userRouter.get('/user/account-check/:token', AsyncHandler(UserController.checkIfClientHasAccount));


export default userRouter;
