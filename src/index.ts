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

function aggregate(result: { [key: string]: Array<{ [key: string]: number }> }, testCount: number) {
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
        for (let [key, value] of Object.entries<number>(agg)) {
            agg[key] = value / testCount;
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

const testCount = Number(process.argv[2]);
const requestCount = Number(process.argv[3]);;
const result: Record<string, any> = {};

for (let i = 0; i < testCount; i++) {
    for (let [name, path] of Object.entries(MODULES)) {
        const f = cp.fork(path);
        f.on('message', async (message: any) => {
            const { event, data } = message;
            if (event == 'ready') {
                await request(requestCount);
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

console.log(aggregate(result, testCount));
