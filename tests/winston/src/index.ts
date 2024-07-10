import * as stream from 'node:stream';
import { transports, createLogger, format } from 'winston';
const { combine, timestamp, label, printf } = format;
import { test } from 'streams-logger-benchmark/dist/test.js';

stream.setDefaultHighWaterMark(true, 1e6);
stream.setDefaultHighWaterMark(false, 1e6);

const myFormat = printf(({ level, message, timestamp }: any) => {
    return `${timestamp} ${level}: ${message}`;
});

const consoleHandler = new transports.Console();
const log = createLogger({
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [
        consoleHandler,
    ]
});

test(log);