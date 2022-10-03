const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const { userRouters } = require('./user');
const { moviesRouters } = require('./movies');
// const { auth } = require('../middlewares/auth');
const NotfoundError = require('../utils/NotfoundError');
const { login, createUser, logout } = require('../controllers/user');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
router.get('/signout', logout);
// router.use(auth);
router.use(userRouters);
router.use(moviesRouters);
router.use((req, res, next) => {
  next(new NotfoundError('Произошла ошибка'));
});
router.use(errors());

module.exports = router;
