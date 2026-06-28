/**
 * Asset price chart with Simple Moving Averages
 *
 * Uses Measure to compute 7-day and 20-day SMAs for a stream of daily closing
 * prices, then draws all three series as an ASCII chart in the terminal.
 * A "golden cross" target check shows whether the short-term SMA has crossed
 * above the long-term SMA — a common bullish signal in technical analysis.
 *
 * Run:
 *   npm run build          # build the library first
 *   node examples/price-chart.js
 *
 * In a standalone project, replace the import with:
 *   import Measure from '@anephenix/measure';
 *
 * For production-quality terminal charts, consider the `asciichart` npm package.
 */

import Measure from '../dist/index.js';

// ---------------------------------------------------------------------------
// 60 days of simulated daily closing prices (USD)
// In a real application you would fetch these from a market data API.
// ---------------------------------------------------------------------------
const closingPrices = [
  142.5, 144.2, 143.8, 146.1, 148.3, 147.6, 145.9, 146.8, 149.2, 151.0, 152.4,
  150.8, 149.6, 151.3, 153.7, 155.1, 154.2, 152.9, 151.4, 153.0, 156.3, 158.2,
  157.4, 155.8, 154.3, 152.1, 150.6, 148.9, 147.2, 149.8, 151.6, 153.4, 155.9,
  157.8, 159.2, 161.0, 160.3, 158.7, 157.1, 155.5, 153.8, 152.3, 154.7, 157.2,
  159.6, 161.4, 163.2, 162.1, 160.5, 158.9, 157.3, 159.1, 161.8, 164.3, 166.2,
  168.0, 167.1, 165.4, 163.7, 162.0,
];

const m = new Measure({ type: 'sample' });
m.record(closingPrices);

const sma7 = m.simpleMovingAverage(7);
const sma20 = m.simpleMovingAverage(20);

// ---------------------------------------------------------------------------
// Summary statistics
// ---------------------------------------------------------------------------
console.log('=== Asset Price Analysis (60 days) ===\n');
console.log(`  Mean close:    $${m.mean().toFixed(2)}`);
console.log(`  Median close:  $${m.median().toFixed(2)}`);
console.log(`  Std deviation: $${m.stdev().toFixed(2)}`);
console.log(`  High:          $${Math.max(...closingPrices).toFixed(2)}`);
console.log(`  Low:           $${Math.min(...closingPrices).toFixed(2)}`);

// ---------------------------------------------------------------------------
// Latest SMA values and golden-cross target check
// ---------------------------------------------------------------------------
const latestSma7 = sma7.at(-1);
const latestSma20 = sma20.at(-1);

// Target: mean of the last 7 days should be above the current 20-day SMA
// (i.e. a golden cross — bullish momentum signal)
const goldenCross = new Measure({
  type: 'sample',
  target: { stat: 'mean', operator: '>', value: latestSma20 },
});
goldenCross.record(closingPrices.slice(-7));

console.log('\n── Simple Moving Averages (current values) ──');
console.log(`  SMA-7:  $${latestSma7.toFixed(2)}`);
console.log(`  SMA-20: $${latestSma20.toFixed(2)}`);

const crossStatus = goldenCross.targetStatus();
console.log(
  `  Golden cross (SMA-7 > SMA-20): ${crossStatus.achieved ? 'YES — bullish signal' : 'NO  — bearish signal'}`
);
console.log(
  `  SMA-7 value: $${crossStatus.actual.toFixed(2)}, threshold: $${latestSma20.toFixed(2)}`
);

// ---------------------------------------------------------------------------
// Last 10 days: price vs SMA table
// ---------------------------------------------------------------------------
console.log('\n── Last 10 days ──');
console.log(`  Day  Close      SMA-7      SMA-20`);
console.log(`  ───  ─────────  ─────────  ─────────`);
for (let i = closingPrices.length - 10; i < closingPrices.length; i++) {
  const day = String(i + 1).padStart(3);
  const price = `$${closingPrices[i].toFixed(2)}`.padStart(9);
  const s7 = `$${sma7[i].toFixed(2)}`.padStart(9);
  const s20 = `$${sma20[i].toFixed(2)}`.padStart(9);
  console.log(`  ${day}  ${price}  ${s7}  ${s20}`);
}

// ---------------------------------------------------------------------------
// ASCII chart: price (·), SMA-7 (○), SMA-20 (◆)
// Each point is plotted on a grid; SMA series are drawn behind price data.
// ---------------------------------------------------------------------------
const CHART_HEIGHT = 18;
const CHART_WIDTH = closingPrices.length;

const allValues = [...closingPrices, ...sma7, ...sma20];
const minVal = Math.min(...allValues);
const maxVal = Math.max(...allValues);
const range = maxVal - minVal;

function toRow(value) {
  return (
    CHART_HEIGHT -
    1 -
    Math.round(((value - minVal) / range) * (CHART_HEIGHT - 1))
  );
}

// Build grid — draw from back (SMA-20) to front (price) so price dots sit on top
const grid = Array.from({ length: CHART_HEIGHT }, () =>
  Array(CHART_WIDTH).fill(' ')
);

for (let i = 0; i < sma20.length; i++) grid[toRow(sma20[i])][i] = '◆';
for (let i = 0; i < sma7.length; i++) grid[toRow(sma7[i])][i] = '○';
for (let i = 0; i < closingPrices.length; i++)
  grid[toRow(closingPrices[i])][i] = '·';

console.log('\n── Price Chart ──\n');
for (let y = 0; y < CHART_HEIGHT; y++) {
  const price = maxVal - (y / (CHART_HEIGHT - 1)) * range;
  const label = `$${price.toFixed(0)}`.padStart(6);
  console.log(`${label} │${grid[y].join('')}`);
}

// X-axis with day markers every 10 days
const xAxis = Array(CHART_WIDTH).fill(' ');
for (let i = 0; i < CHART_WIDTH; i += 10) {
  const label = `D${i + 1}`;
  for (let c = 0; c < label.length && i + c < CHART_WIDTH; c++) {
    xAxis[i + c] = label[c];
  }
}
console.log(`       └${'─'.repeat(CHART_WIDTH)}`);
console.log(`        ${xAxis.join('')}`);
console.log('\n  · Price   ○ SMA-7   ◆ SMA-20');
