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
