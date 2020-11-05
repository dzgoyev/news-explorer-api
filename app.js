const express = require('express');

const mongoose = require('mongoose');

const {PORT = 3000} = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/newsdb', { // можно выести все в confige.js
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.listen(PORT);
