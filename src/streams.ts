import './result.js';
import * as stream from 'node:stream';
import * as fs from 'node:fs';
import { Logger, Formatter, ConsoleHandler, SyslogLevel, Config, RotatingFileHandler } from 'streams-logger';
import args from './args.js';
const run = (await import(`./${args.test}.js`)).default;

// stream.setDefaultHighWaterMark(true, 1e5);
// stream.setDefaultHighWaterMark(false, 1e5);

Config.highWaterMark = 1e5;
Config.highWaterMarkObjectMode = 1e5;
// Config.captureStackTrace = false;

if (fs.existsSync('streams.log')) {
    fs.rmSync('streams.log');
}

const logger = new Logger({ level: SyslogLevel.DEBUG, name: 'test', parent: null, captureStackTrace: false });
const formatter = new Formatter({
    format: async ({ isotime, message, level }) => {
        return `${isotime} ${level}: ${message}\n`;
    }
});
const consoleHandler = new ConsoleHandler({ level: SyslogLevel.DEBUG });
const rotatingFileHandler = new RotatingFileHandler({ path: 'streams.log', level: SyslogLevel.DEBUG, maxSize: 1e8 });

const log = logger.connect(
    formatter.connect(
        consoleHandler,
        rotatingFileHandler
    )
);

run(log);