# Measure

A measurement framework from Anephenix

[![npm version](https://badge.fury.io/js/%40anephenix%2Fmeasure.svg)](https://badge.fury.io/js/%40anephenix%2Fmeasure) ![example workflow](https://github.com/anephenix/measure/actions/workflows/main.yml/badge.svg) [![Socket Badge](https://socket.dev/api/badge/npm/package/@anephenix/measure)](https://socket.dev/npm/package/@anephenix/measure)

## What is Measure?

Measure is a lightweight statistical library for Node.js and browser environments. It lets you collect a series of numeric or date values in memory and immediately run statistical analysis on them — no external database or data-science runtime required.

## When would I use it?

- You're sampling sensor readings, API response times, or CPU metrics and want to spot trends on the fly.
- You're building a dashboard that needs a live mean, median, or moving average without shipping a full analytics stack.
- You want to gate some behaviour on a statistical condition (e.g. "alert me once the mean latency exceeds 500 ms").
- You're collecting timestamped events and want a quick breakdown by hour, day of week, or year.

## Install

```shell
npm i @anephenix/measure
```

### Requirements

- Node.js 22+

---

## Features

### 1. Recording values

Create a `Measure` instance and push values into it one at a time or in bulk.

```javascript
import Measure from '@anephenix/measure';

const measure = new Measure(); // type defaults to 'sample'

measure.record(42);
measure.record([17, 23, 8]);

// Access the raw list at any time
console.log(measure.recordings); // [42, 17, 23, 8]
```

The `type` option controls how variance and standard deviation are calculated:

| `type`       | Use when…                                               |
|--------------|---------------------------------------------------------|
| `'sample'`   | Your recordings are a sample of a larger population (default) |
| `'population'` | Your recordings *are* the full population             |
| `'date'`     | You are recording `Date` objects (see §6 below)         |

---

### 2. Descriptive statistics

Once you have recordings you can derive the most common summary statistics.

```javascript
const m = new Measure();
m.record([4, 7, 7, 2, 9]);

m.mean();    // 5.8  — arithmetic average
m.median();  // 7    — middle value when sorted
m.mode();    // [7]  — most frequent value(s); returns an array
m.counts();  // { '2': 1, '4': 1, '7': 2, '9': 1 }
```

All methods return `null` when there are no recordings yet.

`mode()` returns an array because a dataset can be multimodal:

```javascript
const m = new Measure();
m.record([1, 1, 2, 2, 3]);
m.mode(); // [1, 2]
```

---

### 3. Spread and variability

Understand how spread out your recordings are.

```javascript
const m = new Measure({ type: 'sample' });
m.record([2, 4, 4, 4, 5, 5, 7, 9]);

m.variance(); // 4.571…
m.stdev();    // 2.138…
```

Use `type: 'population'` to divide by N instead of N−1:

```javascript
const pop = new Measure({ type: 'population' });
pop.record([2, 4, 4, 4, 5, 5, 7, 9]);

pop.variance(); // 4      (exact population variance)
pop.stdev();    // 2
```

---

### 4. Standard score (Z-score)

Find out how many standard deviations a particular value sits from the mean.

```javascript
const m = new Measure();
m.record([10, 20, 30, 40, 50]);

m.zscore(30); // 0    — exactly on the mean
m.zscore(50); // 1.26 — above average
m.zscore(10); // -1.26
```

---

### 5. Simple Moving Average (SMA)

Smooth out noise by computing a rolling average over the last *N* recordings.

```javascript
const m = new Measure();
m.record([1, 2, 3, 4, 5, 6]);

// Window of 3 — each value is the average of the current and two preceding values
m.simpleMovingAverage(3); // [1, 1.5, 2, 3, 4, 5]

// No window size — returns a cumulative average at each point
m.simpleMovingAverage(); // [1, 1.5, 2, 2.5, 3, 3.5]
```

This is useful when you want to display a trend line that isn't thrown off by individual spikes.

---

### 6. Date analysis

Use `type: 'date'` to record `Date` objects and count how many fall into each bucket for a given time unit.

```javascript
const dateMeasure = new Measure({ type: 'date' });

dateMeasure.record(new Date('2024-01-15T10:30:00'));
dateMeasure.record(new Date('2024-03-20T14:00:00'));
dateMeasure.record(new Date('2025-01-15T10:45:00'));

dateMeasure.countBy('year');      // { '2024': 2, '2025': 1 }
dateMeasure.countBy('month');     // { '0': 2, '2': 1 }   (0-based: 0 = Jan)
dateMeasure.countBy('dayOfWeek'); // { '1': 1, '3': 2 }   (0-based: 0 = Sun)
dateMeasure.countBy('hour');      // { '10': 2, '14': 1 }
```

Supported units: `'year'`, `'month'`, `'date'`, `'dayOfWeek'`, `'hour'`, `'minute'`, `'second'`, `'millisecond'`

`countBy()` returns `null` when there are no recordings yet.

---

### 7. Target tracking

Define a statistical goal up front and check whether your recordings have hit it.

```javascript
const m = new Measure({
  target: { stat: 'mean', operator: '>', value: 80 },
});

m.record([72, 85, 91, 78, 88]);

m.targetAchieved(); // true  (mean is 82.8)

m.targetStatus();
// {
//   target:   { stat: 'mean', operator: '>', value: 80 },
//   actual:   82.8,
//   achieved: true,
// }
```

`targetAchieved()` returns `null` before any recordings are added.

**Supported stats for targets:** `'mean'`, `'median'`, `'mode'`, `'variance'`, `'stdev'`, `'zscore'`

**Supported operators:** `'>'`, `'<'`, `'>='`, `'<='`, `'='`

```javascript
// Target examples for each stat
new Measure({ target: { stat: 'median',   operator: '>=', value: 85  } });
new Measure({ target: { stat: 'mode',     operator: '=',  value: 3   } }); // passes when mode array includes 3
new Measure({ target: { stat: 'variance', operator: '<',  value: 2   } });
new Measure({ target: { stat: 'stdev',    operator: '<=', value: 1.5 } });
new Measure({ target: { stat: 'zscore',   operator: '>',  value: 0.5, input: 4 } });
```

For `zscore` targets, supply an `input` field — the value whose z-score is computed against the current recordings.

---

## Development

### Running tests

```shell
npm test
```

### Running tests with coverage

```shell
npm run cover
```

### Linting

```shell
npm run lint
```

### Auto-formatting

```shell
npm run format
```

### Bundle size check

```shell
npm run size
```

To see a breakdown of what is contributing to the bundle size:

```shell
npm run analyze
```

---

### License and Credits

&copy; 2026 Anephenix Ltd. Measure is licensed under the MIT license.
