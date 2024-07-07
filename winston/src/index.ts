/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('node:fs');
const stream = require('node:stream');
import { Console } from 'node:console';
const threads = require('node:worker_threads');
const { transports, createLogger, format } = require('winston');
const { combine, timestamp, label, printf } = format;
import { WorkerData } from 'streams-logger-benchmark';

const {iteration, wait, repeat} = <WorkerData>threads.workerData;

stream.setDefaultHighWaterMark(true, 1e6);
stream.setDefaultHighWaterMark(false, 1e6);

if (fs.existsSync('./winston/message.log')) {
  fs.rmSync('./winston/message.log');
}

const myFormat = printf(({ level, message, timestamp }: any) => {
  return `${timestamp}:${level}:${message}`;
});

var log = createLogger({
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      level: 'info',
      filename: './winston/message.log',
    })
  ]
});

const out = fs.createWriteStream('winston.out', { flags: 'w', autoClose: true });
const console = new Console({stdout:out, stderr:out});

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