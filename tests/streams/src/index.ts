import * as stream from 'node:stream';
import * as http from 'node:http';
import { Logger, Formatter, ConsoleHandler, SyslogLevel, Config } from 'streams-logger';

stream.setDefaultHighWaterMark(true, 1e6);
stream.setDefaultHighWaterMark(false, 1e6);

Config.setCaptureStackTrace(false);

const logger = new Logger({ level: SyslogLevel.DEBUG, name: 'test', parent: null });
const formatter = new Formatter({
    format: async ({ isotime, message, level }) => {
        return `${isotime}:${level}:${message}\n`;
    }
});
const consoleHandler = new ConsoleHandler({ level: SyslogLevel.DEBUG });
const log = logger.connect(
    formatter.connect(
        consoleHandler
    )
);

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
