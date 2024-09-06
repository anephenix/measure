# Measure

A measurement framework from Anephenix

[![npm version](https://badge.fury.io/js/%40anephenix%2Fmeasure.svg)](https://badge.fury.io/js/%40anephenix%2Fmeasure) ![example workflow](https://github.com/anephenix/measure/actions/workflows/main.yml/badge.svg) [![Maintainability](https://api.codeclimate.com/v1/badges/29e00e4e0818c7d50786/maintainability)](https://codeclimate.com/github/anephenix/measure/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/29e00e4e0818c7d50786/test_coverage)](https://codeclimate.com/github/anephenix/measure/test_coverage) [![Socket Badge](https://socket.dev/api/badge/npm/package/@anephenix/measure)](https://socket.dev/npm/package/@anephenix/measure)


### Install

```shell
npm i @anephenix/measure
```

### Dependencies

- Node.js (version 20+)

### Usage

```javascript
// Setting up your Measure instance
const measure = new Measure({
  // Can be either 'sample' or 'population' - default value is sample
  type: 'sample',
});

// I want to record some measurements locally
const value = 2;
measure.record(value);

// Or pass more values
const moreValues = [3, 4, 5];
measure.record(moreValues);

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

// Calculate the standard score (z-score) of a value
measure.zscore(3);
```

### Tests

```shell
npm t
```

### License and Credits.

&copy; 2024 Anephenix OÜ. Measure is licensed under the MIT license.
