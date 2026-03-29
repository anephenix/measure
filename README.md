# Measure

A measurement framework from Anephenix

[![npm version](https://badge.fury.io/js/%40anephenix%2Fmeasure.svg)](https://badge.fury.io/js/%40anephenix%2Fmeasure) ![example workflow](https://github.com/anephenix/measure/actions/workflows/main.yml/badge.svg) [![Socket Badge](https://socket.dev/api/badge/npm/package/@anephenix/measure)](https://socket.dev/npm/package/@anephenix/measure)


### Install

```shell
npm i @anephenix/measure
```

### Dependencies

- Node.js (version 22+)

### Usage

```javascript
// Setting up your Measure instance
const measure = new Measure({
  // Can be 'sample', 'population', or 'date' - default value is sample
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

// Calculate the simple moving average over the last N recordings
measure.simpleMovingAverage(3); // Returns the average of the last 3 recordings

// Measuring dates
// Use type 'date' to record Date objects and analyse them by time unit
const dateMeasure = new Measure({ type: 'date' });
dateMeasure.record(new Date('2024-01-15T10:30:45'));
dateMeasure.record(new Date('2024-03-20T14:00:00'));
dateMeasure.record(new Date('2025-01-15T10:45:00'));

// Count recordings by a date unit - returns an object of unit-value → count
// Supported units: 'year', 'month', 'date', 'dayOfWeek', 'hour', 'minute', 'second', 'millisecond'
// month uses 0-based indexing (0 = January, 11 = December)
// dayOfWeek uses 0-based indexing (0 = Sunday, 6 = Saturday)
dateMeasure.countBy('year');      // { '2024': 2, '2025': 1 }
dateMeasure.countBy('month');     // { '0': 2, '2': 1 }
dateMeasure.countBy('dayOfWeek'); // { '1': 1, '3': 2 }
dateMeasure.countBy('hour');      // { '10': 2, '14': 1 }
```

### Tests

```shell
npm t
```

### License and Credits.

&copy; 2026 Anephenix Ltd. Measure is licensed under the MIT license.

