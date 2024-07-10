# Benchmarking the *Streams* Logger

## Introduction

This package provides a rough benchmark comparison between *Streams*, Pino, and Winston.  The comparison may not take into account every optimization offered by each package - *this is a work in progress*.  Please see the implementations for details.  The goal here is to get a rough idea how the logger performs in the simple server environment.

## Materials

- [Streams](https://github.com/faranalytics/streams-logger-benchmark/blob/main/tests/streams/src/index.ts)
- [Pino](https://github.com/faranalytics/streams-logger-benchmark/blob/main/tests/pino/src/index.ts)
- [Winston](https://github.com/faranalytics/streams-logger-benchmark/blob/main/tests/winston/src/index.ts)

## Methods

The loggers are configured to log a message that roughly resembles `2024-07-10T02:31:33.797Z INFO: Hello, World!`.

### Procedure
1. Start a child process.
2. Import the logger.
2. Start an HTTP server. 
2. Send concurrent HTTP requests and log each request to the console.
2. Repeat (1) 1000 times.
3. Calculate the mean time and memory usage of each iteration.

## Results

`npm start 1e3 1e3`

## Discussion

The results seem to vary considerably on each run.