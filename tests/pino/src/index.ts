import stream from 'node:stream';
import { test } from 'streams-logger-benchmark/dist/test.js';
import { pino } from 'pino';

stream.setDefaultHighWaterMark(true, 1e6);
stream.setDefaultHighWaterMark(false, 1e6);

const log = pino({
    transport: {
        target: "pino-pretty",
        options: {
            translateTime: "yyyy-mm-dd HH:MM:ss.l",
            ignore: 'pid,hostname',
            colorize: false,
        }
    },
});

test(log);
