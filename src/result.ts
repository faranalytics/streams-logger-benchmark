const start = Date.now();
process.once('exit', () => {
    process.send?.({ event: 'result', data: { ...{ time: Date.now() - start }, ...process.memoryUsage() } });
});