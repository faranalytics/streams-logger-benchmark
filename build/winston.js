import './result.js';
import * as stream from 'node:stream';
import * as fs from 'node:fs';
import { transports, createLogger, format } from 'winston';
import args from './args.js';
const run = (await import(`./${args.test}.js`)).default;
stream.setDefaultHighWaterMark(true, 1e5);
stream.setDefaultHighWaterMark(false, 1e5);
const { combine, timestamp, printf } = format;
if (fs.existsSync('winston.log')) {
    fs.rmSync('winston.log');
}
const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});
const consoleHandler = new transports.Console();
const fileHandler = new transports.File({ filename: 'winston.log' });
const log = createLogger({
    format: combine(timestamp(), myFormat),
    transports: [
        consoleHandler,
        fileHandler
    ]
});
run(log);
