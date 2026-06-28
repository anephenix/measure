/**
 * System benchmark
 *
 * Uses Measure alongside the Node.js `os` module to profile a workload across
 * multiple runs. Reports mean, median, standard deviation, and a simple moving
 * average of execution times so you can spot warm-up effects or performance
 * drift across runs. Memory usage is also tracked.
 *
 * Run:
 *   npm run build          # build the library first
 *   node examples/system-benchmark.js
 *
 * In a standalone project, replace the import with:
 *   import Measure from '@anephenix/measure';
 */

import os from 'node:os';
import Measure from '../dist/index.js';

// ---------------------------------------------------------------------------
// Workload to benchmark
// Replace this with whatever function you want to profile.
// ---------------------------------------------------------------------------
function workload() {
  let sum = 0;
  for (let i = 1; i <= 500_000; i++) {
    sum += Math.sqrt(i) * Math.log(i);
  }
  return sum;
}

// Snapshot of system memory used as a percentage
function memUsedPercent() {
  return ((os.totalmem() - os.freemem()) / os.totalmem()) * 100;
}

// ---------------------------------------------------------------------------
// Benchmark configuration
// ---------------------------------------------------------------------------
const RUNS = 20;
const SMA_WINDOW = 5;
const TARGET_MAX_MS = 100; // we want mean execution time under this

const execMs = new Measure({ type: 'sample' });
const memUsage = new Measure({ type: 'sample' });

// Target: mean execution time should stay under TARGET_MAX_MS
const targetMeasure = new Measure({
  type: 'sample',
  target: { stat: 'mean', operator: '<', value: TARGET_MAX_MS },
});

// ---------------------------------------------------------------------------
// Run the benchmark
// ---------------------------------------------------------------------------
console.log(`=== Workload Benchmark (${RUNS} runs) ===\n`);
console.log(`  Run   Time (ms)   Mem used (%)`);
console.log(`  ───   ─────────   ────────────`);

for (let i = 1; i <= RUNS; i++) {
  const memBefore = memUsedPercent();
  const t0 = performance.now();

  workload();

  const elapsed = performance.now() - t0;
  const memAvg = (memUsedPercent() + memBefore) / 2;

  execMs.record(elapsed);
  targetMeasure.record(elapsed);
  memUsage.record(memAvg);

  console.log(
    `  ${String(i).padStart(3)}   ${elapsed.toFixed(3).padStart(9)}   ${memAvg.toFixed(1).padStart(12)}`
  );
}

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------
const sma = execMs.simpleMovingAverage(SMA_WINDOW);

console.log('\n── Execution time (ms) ──');
console.log(`  Mean:            ${execMs.mean().toFixed(3)}`);
console.log(`  Median:          ${execMs.median().toFixed(3)}`);
console.log(`  Std deviation:   ${execMs.stdev().toFixed(3)}`);
console.log(`  Variance:        ${execMs.variance().toFixed(3)}`);
console.log(`  Min:             ${Math.min(...execMs.recordings).toFixed(3)}`);
console.log(`  Max:             ${Math.max(...execMs.recordings).toFixed(3)}`);

console.log(`\n── SMA(${SMA_WINDOW}) per run (smoothed trend) ──`);
console.log(`  ${sma.map((v) => v.toFixed(1)).join(', ')}`);

// A rising SMA suggests warm-up effects or increasing load; falling suggests JIT
// optimisation kicking in.
const firstHalf = sma.slice(0, Math.floor(RUNS / 2));
const secondHalf = sma.slice(Math.floor(RUNS / 2));
const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
const trend =
  avgSecond < avgFirst
    ? 'improving (possible JIT effect)'
    : avgSecond > avgFirst
      ? 'degrading — investigate system load'
      : 'stable';
console.log(`  Trend (first half vs second half): ${trend}`);

console.log('\n── Memory usage (%) ──');
console.log(`  Mean:            ${memUsage.mean().toFixed(1)}`);
console.log(`  Std deviation:   ${memUsage.stdev().toFixed(1)}`);

console.log(`\n── Target: mean exec time < ${TARGET_MAX_MS} ms ──`);
const status = targetMeasure.targetStatus();
console.log(`  Actual mean: ${status.actual.toFixed(3)} ms`);
console.log(`  Target achieved: ${status.achieved}`);
