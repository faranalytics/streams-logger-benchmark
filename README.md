# Benchmarking the *Streams* Logger

## Introduction

This package provides a rough benchmark comparison between *Streams*, Pino, and Winston.  The comparison may not take into account relevant optimizations offered by each package - *this is a work in progress*.  Please see the implementations for details.

## Materials

- [Streams](https://github.com/faranalytics/streams-logger-benchmark/blob/main/src/streams.ts)
- [Pino](https://github.com/faranalytics/streams-logger-benchmark/blob/main/src/pino.ts)
- [Winston](https://github.com/faranalytics/streams-logger-benchmark/blob/main/src/winston.ts)

## Methods

### Hello, World!

Each logger is configured to log a message to the console and a file that roughly resembles `2024-07-10T02:31:33.797Z INFO: Hello, World!`.  Each logger is ran once on each `iteration`.

#### Procedure
1. Start a child process.
2. Start the timer.
3. Configure the logger.
4. Run the specified test `hello_world.js` 1e2 times.
5. Log Hello, World! to the console and to a file 10000 times.
3. Calculate the mean time and memory usage of each iteration.

#### Run the Test

`npm start iteration=1e2 test=hello_world`

## Results

## Discussion

