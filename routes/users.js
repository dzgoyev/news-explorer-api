const userRouter = require('express').Router();

const { getUserInfo } = require('../controllers/user');

userRouter.get('/users/me', getUserInfo);

module.exports = userRouter;
