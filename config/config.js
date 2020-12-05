const {
  PORT = 3000,
  MONGODB_ADRESS = 'mongodb://localhost:27017/newsdb',
  DB_OPTIONS = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
} = process.env;

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const CORS_OPTIONS = {
  origin: ['http://localhost:3001', 'https://localhost:3000', 'http://localhost:3000', 'https://localhost:3001', 'http://www.dot2.students.nomoreparties.space'],
  credentials: true,
};

module.exports = {
  JWT_SECRET: (process.env.NODE_ENV !== 'production') ? 'dev-secret' : process.env.JWT_SECRET,
  PORT,
  MONGODB_ADRESS,
  DB_OPTIONS,
  limiter,
  CORS_OPTIONS,
};
