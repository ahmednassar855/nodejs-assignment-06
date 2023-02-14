import express from 'express';
import * as userController from "./user.controller.js";

const userRouter = express.Router();

userRouter.post('/api/user/signup' , userController.addUser)
userRouter.post('/api/user/signin' , userController.singin)
userRouter.delete('/api/user/deleteUser' , userController.deleteUser)
userRouter.put('/api/user/updateUser' , userController.updateUser)
userRouter.put('/api/user/updateUserType' , userController.updateUserType)

userRouter.get('/api/users' , userController.getAllUsers);
userRouter.post('/api/user/userById' , userController.getUserById)
userRouter.post('/api/user/userByEmail' , userController.getUserByEmail)

userRouter.post('/api/users/ageLessThan' , userController.getUsersAgeFirstLetter);
userRouter.post('/api/users/userEndLetter' , userController.getUserWithEndByLetter);
userRouter.post('/api/users/userContainsLetter' , userController.getUserContainsLetter);
userRouter.post('/api/users/userMatchName' , userController.getUserWithFullyNameMatch);

export default userRouter;