import * as threads from 'node:worker_threads';
import * as fs from 'node:fs';
import { fork } from 'node:child_process';
import { once } from 'node:events';

export interface WorkerDataOptions {
    iteration: number;
    wait: number;
    repeat: number;
}
export class WorkerData {
    public iteration;
    public wait;
    public repeat;

    constructor({ iteration, wait, repeat }: WorkerDataOptions) {
        this.iteration = iteration;
        this.wait = wait;
        this.repeat = repeat;
    }
}

const STREAMS_PATH = './streams-logger/dist/index.js';
const WINSTON_PATH = './winston/dist/index.js';

['winston.out', 'streams.out'].forEach((path) => {
    if (fs.existsSync(path)) {
        fs.rmSync(path);
    }
});

const workerData = new WorkerData({ iteration: 1e3, repeat: 10, wait: 4 });

const winston = new threads.Worker(WINSTON_PATH, { workerData: workerData });
const streams = new threads.Worker(STREAMS_PATH, { workerData: workerData });

// const winston = fork(WINSTON_PATH);
// const streams = fork(STREAMS_PATH);

await Promise.all([
    once(streams, 'exit'),
    once(winston, 'exit')
]);

console.log('exit');