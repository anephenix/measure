/**
 * CSV export
 *
 * Shows how to pass recorded data through Measure for analysis and then persist
 * both the enriched readings and the summary statistics to CSV files using the
 * Node.js built-in `fs` module — no third-party dependencies required.
 *
 * Two files are written:
 *   readings.csv  — each raw value annotated with its z-score and SMA
 *   summary.csv   — overall descriptive statistics for the dataset
 *
 * From there the files can be opened in a spreadsheet, loaded into a database,
 * or piped into another tool for further analysis.
 *
 * Run:
 *   npm run build          # build the library first
 *   node examples/csv-export.js
 *
 * In a standalone project, replace the import with:
 *   import Measure from '@anephenix/measure';
 */

import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Measure from '../dist/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Simulated temperature sensor readings (°C), one per minute over 30 minutes.
// In a real application these would come from a hardware API, database, or
// external service.
// ---------------------------------------------------------------------------
const readings = [
  21.4, 21.6, 21.5, 21.8, 22.1, 22.4, 22.9, 23.5, 24.0, 24.3, 24.1, 23.8, 23.5,
  23.2, 23.0, 22.8, 22.6, 22.4, 22.3, 22.1, 22.0, 21.9, 22.2, 22.5, 22.8, 23.1,
  23.4, 23.7, 24.1, 24.4,
];

const m = new Measure({ type: 'sample' });
m.record(readings);

const sma5 = m.simpleMovingAverage(5);
const mean = m.mean();
const median = m.median();
const stdev = m.stdev();
const variance = m.variance();

// ---------------------------------------------------------------------------
// Build the readings CSV
// Columns: minute, temperature_c, zscore, sma5
// ---------------------------------------------------------------------------
const readingsRows = [
  ['minute', 'temperature_c', 'zscore', 'sma5'],
  ...readings.map((value, i) => [
    i + 1,
    value.toFixed(1),
    m.zscore(value).toFixed(4),
    sma5[i].toFixed(4),
  ]),
];

const readingsCsv = readingsRows.map((row) => row.join(',')).join('\n');

// ---------------------------------------------------------------------------
// Build the summary statistics CSV
// Columns: stat, value
// ---------------------------------------------------------------------------
// mode() is intentionally excluded here: it targets discrete integer data and
// is not meaningful for continuous float measurements like sensor readings.
const summaryRows = [
  ['stat', 'value'],
  ['count', readings.length],
  ['mean', mean.toFixed(4)],
  ['median', median.toFixed(4)],
  ['stdev', stdev.toFixed(4)],
  ['variance', variance.toFixed(4)],
  ['min', Math.min(...readings).toFixed(1)],
  ['max', Math.max(...readings).toFixed(1)],
];

const summaryCsv = summaryRows.map((row) => row.join(',')).join('\n');

// ---------------------------------------------------------------------------
// Write both files
// ---------------------------------------------------------------------------
const readingsPath = join(__dirname, 'readings.csv');
const summaryPath = join(__dirname, 'summary.csv');

await writeFile(readingsPath, readingsCsv, 'utf8');
console.log(`Readings written to: ${readingsPath}`);

await writeFile(summaryPath, summaryCsv, 'utf8');
console.log(`Summary written to:  ${summaryPath}`);

// ---------------------------------------------------------------------------
// Quick preview in the terminal
// ---------------------------------------------------------------------------
console.log('\n── readings.csv (first 5 rows) ──');
console.log(
  readingsRows
    .slice(0, 6)
    .map((r) => r.join('\t'))
    .join('\n')
);

console.log('\n── summary.csv ──');
console.log(summaryRows.map((r) => r.join('\t')).join('\n'));
