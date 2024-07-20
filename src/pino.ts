import './result.js';
import * as stream from 'node:stream';
import * as fs from 'node:fs';
import { pino } from 'pino';
import args from './args.js';
const run = (await import(`./${args.test}.js`)).default;

stream.setDefaultHighWaterMark(true, 1e6);
stream.setDefaultHighWaterMark(false, 1e6);

if (fs.existsSync('pino.log')) {
    fs.rmSync('pino.log');
}

const transport = pino.transport({
    targets: [
        {
            target: "pino-pretty",
            options: {
                translateTime: "yyyy-mm-dd HH:MM:ss.l",
                ignore: 'pid,hostname',
                colorize: false,
                destination: 1
            }
        },
        {
            target: "pino-pretty",
            options: {
                translateTime: "yyyy-mm-dd HH:MM:ss.l",
                ignore: 'pid,hostname',
                colorize: false,
                destination: 'pino.log'
            }
        }
    ]
})

const log = pino(transport);

run(log);