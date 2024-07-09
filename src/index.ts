import * as cp from 'node:child_process'
import * as http from 'node:http';
import { once } from 'node:events';

async function request(iterations: number) {
    const reqs = []
    for (let i = 0; i < iterations; i++) {
        const DATA = 'Hello, World!'.repeat(1e1);
        const req = http.request({
            'hostname': '127.0.0.1', 'port': 3000, 'method': 'GET', headers: {
                'Content-Length': Buffer.byteLength(DATA),
            },
        });
        reqs.push(once(req, 'close'));
        req.end(DATA);
    }
    return Promise.allSettled(reqs);
}

function aggregate(result: { [key: string]: Array<{ [key: string]: number }> }) {
    for (let [name, arr] of Object.entries(result)) {
        const agg = arr.reduce((acc: any, curr: any) => {
            if (!acc) {
                return curr;
            }
            for (let [key, value] of Object.entries(curr)) {
                acc[key] = acc[key] + value;
            }
            return acc;
        }, null);
        for (let [key, value] of Object.entries(agg)) {
            agg[key] = agg[key] / TEST_COUNT;
            if (key == 'time') {
                agg[key] = agg[key] + 'ms';
            }
            else {
                agg[key] = Math.round(agg[key] / 1e6 * 100) / 100 + 'mb';
            }
        }
        result[name] = agg;
    }
    return result;
}

const MODULES = {
    winston: './tests/winston/dist/index.js',
    pino: './tests/pino/dist/index.js',
    streams: './tests/streams/dist/index.js',
}

const TEST_COUNT = 100;
const REQUEST_ITERATIONS = 1e4;

const result: Record<string, any> = {};

for (let i = 0; i < TEST_COUNT; i++) {
    for (let [name, path] of Object.entries(MODULES)) {
        const f = cp.fork(path);
        f.on('message', async (message: any) => {
            const { event, data } = message;
            if (event == 'ready') {
                await request(REQUEST_ITERATIONS);
                f.send({ event: 'exit' });
            }
            else if (event == 'result') {
                if (!result[name]) {
                    result[name] = [];
                }
                result[name].push(<object>data);
            }
        });
        await once(f, 'exit');
    }
}

console.log(aggregate(result));
