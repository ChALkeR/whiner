# whiner

This is a small wrapper around [bole](https://github.com/rvagg/bole) and
[systemd-journald](https://github.com/jue89/node-systemd-journald).

It logs everything to journald by default, but supports streaming JSON logs to
other sources, using `.output` inherited from bole.

## Usage

```js
const log = require('whiner')(module);

log.error(error);
log.debug(message, fields);
```

or 

```js
const log = require('whiner')('label');

log.error(error);
log.debug(message, info);
```

## Log levels

* `emergency` — `emerg` in journald, `error` in bole,
* `critical` — `crit` in journald, `error` in bole,
* `error` — `err` in journald, `error` in bole,
* `alert` — `alert` in journald, `warn` in bole,
* `warning` — `warn` in journald, `warn` in bole,
* `info` — `emerg` in journald, `info` in bole,
* `notice` — `emerg` in journald, `info` in bole,
* `debug` — `debug` in journald, `debug` in bole.

## License

MIT.
