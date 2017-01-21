'use strict';

function tryRequire(name) {
  try {
    return require(name);
  } catch (e) {
    return undefined;
  }
}

const path = require('path');
const stringify = require('fast-safe-stringify');
const journald = tryRequire('systemd-journald');
const bole = tryRequire('bole');

const pid = process.pid;
const hostname = stringify(require('os').hostname());

const levels = {
  emergency: { journald: 'emerg', console: 'error', bole: 'error' },
  critical: { journald: 'crit', console: 'error', bole: 'error' },
  error: { journald: 'err', console: 'error', bole: 'error' },
  alert: { journald: 'alert', console: 'warn', bole: 'warn' },
  warn: { journald: 'warn', console: 'warn', bole: 'warn' },
  info: { journald: 'info', console: 'info', bole: 'info' },
  notice: { journald: 'notice', console: 'info', bole: 'info' },
  debug: { journald: 'debug', console: 'log', bole: 'debug' }
};
const levelsArr = Object.keys(levels);

// NOTE: LOG_LEVEL affects only output to console
let consoleLevel = process.env.LOG_LEVEL;

if (!consoleLevel && !journald && !bole) {
  // By default print everything to console, if no other output is available
  consoleLevel = 'debug';
} else if (consoleLevel && bole) {
  // Handle LOG_LEVEL with bole
  bole.output({
    level: levels[consoleLevel.toLowerCase()].bole,
    stream: process.stdout
  });
}

const consoleLevelIndex = consoleLevel ?
  levelsArr.indexOf(consoleLevel.toLowerCase()) :
  -1;
if (consoleLevel && consoleLevelIndex === -1) {
  throw new Error(`Unknown LOG_LEVEL: ${consoleLevel}!`);
}

const root = require.main ? path.dirname(require.main.filename) : null;

module.exports = name => {
  let label;
  if (typeof name !== 'string') {
    // if it's not a string, it should be a module
    const filepath = root ? path.relative(root, name.filename) : name.filename;
    label = filepath.replace(/\.js$/, '');
  } else {
    label = name;
  }
  const label = typeof name === 'string' ?
    name :
    path.relative(root, name.filename).replace(/\.js$/, '');
  const boleLog = bole ? bole(label) : null;

  return levelsArr.reduce((log, level) => {
    const methods = levels[level];
    const consoleFlag = consoleLevel &&
      levelsArr.indexOf(level) <= consoleLevelIndex;

    log[level] = (message, info = {}) => {
      if (bole) {
        const hasInfo = Object.keys(info).length > 0;
        const entry = { message };
        Object.assign(entry, info);
        boleLog[methods.bole](hasInfo ? entry : message);
      } else if (consoleFlag) {
        const entry = {
          time: new Date().toISOString(),
          hostname,
          pid,
          level,
          name: label,
          message: message.toString()
        };
        if (message.stack) {
          entry.stack = message.stack;
        }
        Object.assign(entry, info);
        // eslint-disable-next-line no-console
        console[methods.console](stringify(entry));
      }
      if (journald) {
        const entry = { label };
        Object.assign(entry, info);
        journald[methods.journald](message, entry);
      }
    };
    return log;
  }, {});
};

if (bole) {
  module.exports.output = opt => bole.output(opt);
}
