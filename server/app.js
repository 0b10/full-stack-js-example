const express = require('express');

const app = express();
const cookieParser = require('cookie-parser');
const { express: elogger } = require('./logger');
const { normal: log } = require('./logger');
const db = require('./db');

app.use(elogger); // pino() returns a logger object, configured, and ready.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

log.info('Server started');

app.post('/register', (req, res) => db.account.create.register(
  req.body.username,
  req.body.email,
  req.body.password,
)
  .then(([account]) => {
    res.send({ account }).status(201);
  })
  .catch(() => {
    res.status(500).send({ error: 'Unable to register account.' });
  }));

module.exports = app;
