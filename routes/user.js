const userRouters = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, updateUser, getUserMe, // getUsers - dev
} = require('../controllers/user');

userRouters.get('/users', getUsers); //dev
userRouters.get('/users/me', getUserMe);
userRouters.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
  }),
}), updateUser);

module.exports = { userRouters };
