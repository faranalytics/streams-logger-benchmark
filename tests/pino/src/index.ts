import * as stream from 'node:stream';
import * as fs from 'node:fs';
import { test } from 'streams-logger-benchmark/dist/test.js';
import { pino } from 'pino';

stream.setDefaultHighWaterMark(true, 1e6);
stream.setDefaultHighWaterMark(false, 1e6);

if (fs.existsSync('pino.log')) {
    fs.rmSync('pino.log');
}

const transport = pino.transport({
    targets:[
        {
            target: "pino-pretty",
            options: {
                translateTime: "yyyy-mm-dd HH:MM:ss.l",
                ignore: 'pid,hostname',
                colorize: false,
            }
        },
        {
            target: 'pino/file',
            options: { destination: 'pino.log' },
        }
    ]
})

const log = pino(transport);

test(log);
