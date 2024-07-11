import * as stream from 'node:stream';
import * as fs from 'node:fs';
import { Logger, Formatter, ConsoleHandler, SyslogLevel, Config, RotatingFileHandler } from 'streams-logger';
import { test } from 'streams-logger-benchmark/dist/test.js';

stream.setDefaultHighWaterMark(true, 1e6);
stream.setDefaultHighWaterMark(false, 1e6);

Config.setDefaultHighWaterMark(true, 1e6);
Config.setDefaultHighWaterMark(false, 1e6);
Config.setCaptureStackTrace(false);


if (fs.existsSync('streams.log')) {
    fs.rmSync('streams.log');
}

const logger = new Logger({ level: SyslogLevel.DEBUG, name: 'test', parent: null });
const formatter = new Formatter({
    format: async ({ isotime, message, level }) => {
        return `${isotime} ${level}: ${message}\n`;
    }
});
const consoleHandler = new ConsoleHandler({ level: SyslogLevel.DEBUG });
const rotatingFileHandler = new RotatingFileHandler({ path: 'streams.log', level: SyslogLevel.DEBUG });

const log = logger.connect(
    formatter.connect(
        consoleHandler,
        rotatingFileHandler
    )
);

test(log);