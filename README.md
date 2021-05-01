# Measure

A measurement framework from Anephenix

### Install

```shell
npm i @anephenix/measure
```

### Dependencies

- Node.js (version 14+)

### Usage

```javascript
// I want to record some measurements locally
const value = 2;

const measure = new Measure();
measure.record(value);

// Get all of the recordings
measure.recordings;

// Calculate the mean, median, and modal values
measure.mean();
measure.median();
measure.mode();

// Get the standard deviation of the measurements
measure.stdev();

// Get the variance of the measurements
measure.variance();

// Get an object detailing how many times each value occurs
measure.counts();
```

### Tests

```shell
npm t
```

### License and Credits.

&copy; 2021 Anephenix OÜ. Measure is licensed under the MIT license.
