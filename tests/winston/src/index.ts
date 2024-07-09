import fs from 'node:fs';
import stream from 'node:stream';
import http from 'node:http';
import { transports, createLogger, format } from 'winston';
const { combine, timestamp, label, printf } = format;

stream.setDefaultHighWaterMark(true, 1e6);
stream.setDefaultHighWaterMark(false, 1e6);

const myFormat = printf(({ level, message, timestamp }: any) => {
    return `${timestamp}:${level}:${message}`;
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

const time1 = Date.now();
const server = http.createServer((req, res) => {
    const chunks: Array<Buffer> = [];
    req.on('data', (data) => {
        chunks.push(data);
    });
    req.on('end', () => {
        log.info(Buffer.concat(chunks).toString());
        res.end('');
    });
});
server.listen(3000, '127.0.0.1', () => {
    process.send?.({ event: 'ready' });
});
process.on('message', (message: any) => {
    const { event, data } = message;
    if (event == 'exit') {
        const time2 = Date.now();
        process.send?.({ event: 'result', data: { ...{ time: time2 - time1 }, ...process.memoryUsage() } });
        setTimeout(process.exit);
    }
});
