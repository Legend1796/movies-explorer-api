const userRouters = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  updateUser, getUserMe,
} = require('../controllers/user');

userRouters.get('/users/me', getUserMe);
userRouters.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUser);

module.exports = { userRouters };
