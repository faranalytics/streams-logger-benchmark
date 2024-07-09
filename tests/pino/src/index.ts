import stream from 'node:stream';
import http from 'node:http';

stream.setDefaultHighWaterMark(true, 1e6);
stream.setDefaultHighWaterMark(false, 1e6);

const log = require('pino')({ 
    timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"` 
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
