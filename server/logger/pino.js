/**
 * Export a ready-to-use pino logger.
 */

// Use the returned pino() func to configure:
//   logger = pino({conf_obj})
const expressPino = require('express-pino-logger');
const pino = require('pino');

let level;
let prettyPrint;
let redact;
let enabled = true;

// Set deired log levels. Get from NODE_ENV.
switch (process.env.NODE_ENV) {
  case 'trace': // NODE_ENV=trace
    level = 'debug';
    prettyPrint = true;
    break;
  case 'test':
    enabled = false; // Disable during testing.
    break;
  case 'debug':
    level = 'debug';
    prettyPrint = true;
    break;
  default: // Production, dev etc..
    level = 'info';
    prettyPrint = false;
    redact = ['params.password'];
    break;
}
const config = { level, prettyPrint, redact, enabled };

const express = expressPino(config);
const normal = pino(config);

// Create and export the logger.
module.exports = {
  normal,
  express,
};
