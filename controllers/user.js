const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UnautorizedError = require('../utils/UnautorizedError');
const BadreqestError = require('../utils/BadreqestError');
const ServerError = require('../utils/ServerError');
const NotfoundError = require('../utils/NotfoundError');
const ConflictError = require('../utils/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      next(new NotfoundError('Такого пользователся не существует'));
    } else {
      res.send({
        _id: user._id, name: user.name, email: user.email,
      });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadreqestError('Переданы некорректные данные'));
    } else {
      next(new ServerError('Произошла ошибка на сервере'));
    }
  }
};

module.exports.createUser = async (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, password: hash,
    });
    res.send({
      _id: user._id, name: user.name, email: user.email,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadreqestError('Переданы некорректные данные'));
    } else if (err.code === 11000) {
      next(new ConflictError('Пользователь с такой электронной почтой уже зарегистрирован'));
    } else {
      next(new ServerError('Произошла ошибка на сервере'));
    }
  }
};

module.exports.updateUser = async (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true },
    );
    if (!user) {
      next(new NotfoundError('Такого пользователся не существует'));
    } else {
      res.send({
        _id: user._id, name: user.name, email: user.email,
      });
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadreqestError('Переданы некорректные данные'));
    } else if (err.code === 11000) {
      next(new ConflictError('Пользователь с такой электронной почтой уже зарегистрирован'));
    } else {
      next(new ServerError('Произошла ошибка на сервере'));
    }
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      next(new UnautorizedError('Неправильные почта или пароль'));
    } else {
      const isUserValid = await bcrypt.compare(password, user.password);
      if (isUserValid) {
        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
          secure: true,
        });
        res.send({
          _id: user._id, name: user.name, about: user.about, avatar: user.avatar, email: user.email,
        });
      } else {
        next(new UnautorizedError('Неправильные почта или пароль'));
      }
    }
  } catch (err) {
    next(new ServerError('Произошла ошибка на сервере'));
  }
};

module.exports.getUserMe = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      next(new NotfoundError('Такого пользователся не существует'));
    } else {
      res.send({
        _id: user._id, name: user.name, email: user.email,
      });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadreqestError('Переданы некорректные данные'));
    } else {
      next(new ServerError('Произошла ошибка на сервере'));
    }
  }
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Вы вышли из аккаунта' });
};
