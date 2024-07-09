# Benchmarking the *Streams* Logger

This package provides a rough benchmark comparison between *Streams*, Pino, and Winston.  The comparison may be more or less fair, as there may be optimizations specific to a particular package that were not implemented - *this is a work in progress*.  Please see the implementations for details.  The goal is to determine if *Streams* performs roughly similar to other loggers given similar environmental conditions.

## Materials

- [Streams](https://github.com/faranalytics/streams-logger-benchmark/blob/main/tests/streams/src/index.ts)
- [Pino](https://github.com/faranalytics/streams-logger-benchmark/blob/main/tests/pino/src/index.ts)
- [Winston](https://github.com/faranalytics/streams-logger-benchmark/blob/main/tests/winston/src/index.ts)

## Methods

1. Receive 1000 concurrent HTTP requests and log each request to the console.
2. Repeat (1) 100 times.
3. Calculate the mean time and memory usage of each iteration.

## Results

`npm start 1e2 1e3`

```js
{
  winston: {
    time: '306.23ms',
    rss: '70.55mb',
    heapTotal: '29.08mb',
    heapUsed: '14.12mb',
    external: '0.81mb',
    arrayBuffers: '0.12mb'
  },
  pino: {
    time: '275.54ms',
    rss: '67.71mb',
    heapTotal: '20.22mb',
    heapUsed: '11.65mb',
    external: '0.85mb',
    arrayBuffers: '0.05mb'
  },
  streams: {
    time: '326.16ms',
    rss: '67.64mb',
    heapTotal: '20.37mb',
    heapUsed: '11.78mb',
    external: '0.76mb',
    arrayBuffers: '0.05mb'
  }
}
```
## Discussion
