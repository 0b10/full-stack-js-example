const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const account = require('./routes/account');

app.use('/account', account);

// app.get('/', (req, res) => {
//   res.send(200);
// });

module.exports = app;
