/* eslint-disable no-unused-vars */
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const {
  PORT,
  MONGODB_ADRESS,
  DB_OPTIONS,
  limiter,
  CORS_OPTIONS,
} = require('./config/config');

const userRouter = require('./routes/users');
const articleRouter = require('./routes/article');
const router = require('./routes');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/NotFoundError');
const errorHandler = require('./middlewares/errorHandler');

mongoose.connect(MONGODB_ADRESS, DB_OPTIONS);

const app = express();

app.use(cors(CORS_OPTIONS));
app.options('*', cors(CORS_OPTIONS));
// app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.use(router);

app.use(auth);
app.use('/', userRouter);
app.use('/', articleRouter);
app.all('*', (req, res) => {
  throw new NotFoundError({ message: 'Ресурс не найден' });
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
