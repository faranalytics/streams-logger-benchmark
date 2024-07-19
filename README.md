# Benchmarking the *Streams* Logger

## Introduction

This package provides a rough benchmark comparison between *Streams*, Pino, and Winston.  The comparison may not take into account every optimization offered by each package - *this is a work in progress*.  Please see the implementations for details.  The goal here is to get a rough idea how *Streams* performs given various environments.

## Materials

- [Streams](https://github.com/faranalytics/streams-logger-benchmark/blob/main/tests/streams/src/index.ts)
- [Pino](https://github.com/faranalytics/streams-logger-benchmark/blob/main/tests/pino/src/index.ts)
- [Winston](https://github.com/faranalytics/streams-logger-benchmark/blob/main/tests/winston/src/index.ts)

## Methods

### Hello, World!

Each logger is configured to log a message that roughly resembles `2024-07-10T02:31:33.797Z INFO: Hello, World!`.  Each logger is ran once for each `iteration`.

#### Procedure
1. Start a child process.
2. Start the timer.
3. Run the specified test e.g., `hello_world.ts`.
3. Calculate the mean time and memory usage of each iteration.

#### Run
`npm start iterations=1e1 test=hello_world`

## Results

## Discussion

