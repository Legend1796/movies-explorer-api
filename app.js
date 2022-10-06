require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');

const { NODE_ENV, PORT, MONGO_URL } = process.env;

const app = express();
const { errorHandler } = require('./middlewares/errorHandler');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { allowedCors } = require('./middlewares/cors');
const { limiter } = require('./middlewares/rateLimiter');

async function main() {
  try {
    await mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/moviesdb', {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    });

    await app.listen(NODE_ENV === 'production' ? PORT : 3000, () => {
      console.log(`App listening on port ${NODE_ENV === 'production' ? PORT : 3000}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();

app.use(helmet());
app.use(allowedCors);
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(limiter);
app.use(router);
app.use(errors());
app.use(errorLogger);
app.use(errorHandler);
