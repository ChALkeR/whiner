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

* `emerg` — `emerg` in journald, `error` in bole,
* `crit` — `crit` in journald, `error` in bole,
* `error` — `err` in journald, `error` in bole,
* `alert` — `alert` in journald, `warn` in bole,
* `warn` — `warn` in journald, `warn` in bole,
* `info` — `info` in journald, `info` in bole,
* `notice` — `notice` in journald, `info` in bole,
* `debug` — `debug` in journald, `debug` in bole.

Notice: `emerg` triggers a global notification with journald, use it wisely.

## License

MIT.
