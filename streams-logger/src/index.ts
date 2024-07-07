/* eslint-disable @typescript-eslint/no-unused-vars */
import { Console } from 'node:console';
import * as fs from 'node:fs';
import * as stream from 'node:stream';
import * as threads from 'node:worker_threads';
import { Logger, Formatter, ConsoleHandler, RotatingFileHandler, SyslogLevel, Config, root } from 'streams-logger';
import { WorkerData } from 'streams-logger-benchmark';

const {iteration, wait, repeat} = <WorkerData>threads.workerData;

stream.setDefaultHighWaterMark(true, 1e6);
stream.setDefaultHighWaterMark(false, 1e6);

Config.setDefaultHighWaterMark(true, 1e6);
Config.setDefaultHighWaterMark(false, 1e6);
Config.setCaptureStackTrace(false);

if (fs.existsSync('./streams-logger/message.log')) {
    fs.rmSync('./streams-logger/message.log');
}

const logger = new Logger({ level: SyslogLevel.DEBUG, name: 'test', parent: null });
const streams_formatter = new Formatter({
    format: async ({ isotime, message, name, level, func, url, line, col }) => {
        return `${isotime}:${level}:${message}\n`;
    }
});
const rotatingFileHandler = new RotatingFileHandler({ path: './streams-logger/message.log', rotations:0, level: SyslogLevel.DEBUG });
const consoleHandler = new ConsoleHandler({ level: SyslogLevel.DEBUG });

const log = logger.connect(
    streams_formatter.connect(
        rotatingFileHandler,
        consoleHandler
    )
);

const out = fs.createWriteStream('streams.out', { flags: 'w', autoClose: true });
const console = new Console({ stdout: out, stderr: out });


console.time('');
(async function () {
    for (let i = 0; i < iteration; i++) {
        log.info('Hello World!'.repeat(repeat));
        await new Promise((r) => setTimeout(r, wait));
    }
}());

process.on('exit', () => {
    console.timeEnd('');
});