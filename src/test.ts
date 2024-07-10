import http from 'node:http';

export function test(log: any) {
    const time1 = Date.now();
    const server = http.createServer((req, res) => {
        const chunks: Array<Buffer> = [];
        req.on('data', (data) => {
            chunks.push(data);
        });
        req.on('end', async () => {
            log.info(Buffer.concat(chunks).toString());
            await new Promise((r) => setTimeout(r, 4));
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
            process.once('exit', () => {
                process.send?.({ event: 'result', data: { ...{ time: time2 - time1 }, ...process.memoryUsage() } });
            });
            process.exit();
        }
    });
}
