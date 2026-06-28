/**
 * Log event analysis
 *
 * Uses Measure's date type to analyse timestamped application log entries.
 * By grouping events with countBy() you can quickly answer questions like:
 *   - Which hours of the day see the most errors?
 *   - Are errors clustered on specific days of the week?
 *   - Is there a seasonal pattern across months?
 *
 * Run:
 *   npm run build          # build the library first
 *   node examples/log-analysis.js
 *
 * In a standalone project, replace the import with:
 *   import Measure from '@anephenix/measure';
 */

import Measure from '../dist/index.js';

// ---------------------------------------------------------------------------
// Sample log data
// In a real application you would parse these from a log file or log stream.
// ---------------------------------------------------------------------------
const rawLogs = [
  // Overnight batch errors (02:00–04:00 window)
  {
    level: 'error',
    message: 'DB connection timeout',
    ts: '2025-01-06T02:13:00',
  },
  {
    level: 'error',
    message: 'DB connection timeout',
    ts: '2025-01-06T02:47:00',
  },
  { level: 'warn', message: 'High memory usage', ts: '2025-01-06T09:02:00' },
  {
    level: 'error',
    message: 'Payment gateway failure',
    ts: '2025-01-07T14:31:00',
  },
  {
    level: 'error',
    message: 'DB connection timeout',
    ts: '2025-01-09T02:05:00',
  },
  {
    level: 'info',
    message: 'Scheduled job complete',
    ts: '2025-01-09T10:00:00',
  },
  {
    level: 'error',
    message: 'Auth service unreachable',
    ts: '2025-02-11T03:20:00',
  },
  {
    level: 'error',
    message: 'DB connection timeout',
    ts: '2025-02-12T02:55:00',
  },
  { level: 'warn', message: 'Slow query detected', ts: '2025-02-14T16:40:00' },
  { level: 'error', message: 'File upload failed', ts: '2025-03-05T01:10:00' },
  {
    level: 'error',
    message: 'DB connection timeout',
    ts: '2025-03-19T02:33:00',
  },
  {
    level: 'error',
    message: 'Payment gateway failure',
    ts: '2025-03-20T13:22:00',
  },
  {
    level: 'error',
    message: 'DB connection timeout',
    ts: '2025-04-08T02:18:00',
  },
  { level: 'warn', message: 'High memory usage', ts: '2025-04-10T08:05:00' },
  {
    level: 'error',
    message: 'DB connection timeout',
    ts: '2025-05-01T02:45:00',
  },
  {
    level: 'error',
    message: 'Auth service unreachable',
    ts: '2025-05-14T03:10:00',
  },
  { level: 'warn', message: 'Disk space low', ts: '2025-05-14T11:30:00' },
  {
    level: 'error',
    message: 'Payment gateway failure',
    ts: '2025-06-02T14:00:00',
  },
  {
    level: 'error',
    message: 'DB connection timeout',
    ts: '2025-06-17T02:22:00',
  },
  { level: 'info', message: 'Deploy complete', ts: '2025-06-20T15:45:00' },
  {
    level: 'error',
    message: 'DB connection timeout',
    ts: '2025-07-03T02:51:00',
  },
  { level: 'warn', message: 'High memory usage', ts: '2025-07-03T09:15:00' },
  {
    level: 'error',
    message: 'Auth service unreachable',
    ts: '2025-08-12T03:05:00',
  },
  {
    level: 'error',
    message: 'Payment gateway failure',
    ts: '2025-09-08T14:20:00',
  },
  { level: 'warn', message: 'Slow query detected', ts: '2025-09-22T10:45:00' },
];

const logs = rawLogs.map((l) => ({ ...l, ts: new Date(l.ts) }));

// Separate into Measure instances by log level
const errorDates = new Measure({ type: 'date' });
const warnDates = new Measure({ type: 'date' });

for (const log of logs) {
  if (log.level === 'error') errorDates.record(log.ts);
  if (log.level === 'warn') warnDates.record(log.ts);
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const BAR_WIDTH = 24;

function bar(count, maxCount) {
  const filled = Math.round((count / maxCount) * BAR_WIDTH);
  return '█'.repeat(filled).padEnd(BAR_WIDTH);
}

function printBreakdown(counts, keyFormatter, title) {
  if (!counts) {
    console.log('  (no data)\n');
    return;
  }
  const entries = Object.entries(counts).sort(
    (a, b) => Number(a[0]) - Number(b[0])
  );
  const maxCount = Math.max(...entries.map((e) => e[1]));
  console.log(`\n  ${title}`);
  for (const [key, count] of entries) {
    const label = keyFormatter(Number(key)).padEnd(6);
    console.log(`  ${label}  ${bar(count, maxCount)}  ${count}`);
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
const errorCount = logs.filter((l) => l.level === 'error').length;
const warnCount = logs.filter((l) => l.level === 'warn').length;
const infoCount = logs.filter((l) => l.level === 'info').length;

console.log('=== Application Log Analysis ===');
console.log(`\nTotal entries: ${logs.length}`);
console.log(`  Errors:   ${errorCount}`);
console.log(`  Warnings: ${warnCount}`);
console.log(`  Info:     ${infoCount}`);

console.log('\n── Error breakdown ──');
printBreakdown(
  errorDates.countBy('hour'),
  (h) => `${String(h).padStart(2, '0')}:00`,
  'By hour of day:'
);
printBreakdown(
  errorDates.countBy('dayOfWeek'),
  (d) => WEEKDAYS[d],
  'By day of week:'
);
printBreakdown(errorDates.countBy('month'), (m) => MONTHS[m], 'By month:');

console.log('\n── Warning breakdown ──');
printBreakdown(
  warnDates.countBy('hour'),
  (h) => `${String(h).padStart(2, '0')}:00`,
  'By hour of day:'
);
printBreakdown(
  warnDates.countBy('dayOfWeek'),
  (d) => WEEKDAYS[d],
  'By day of week:'
);

// Count occurrences of each unique error message to find the noisiest ones
console.log('\n── Top error messages ──');
const messageCounts = {};
for (const log of logs.filter((l) => l.level === 'error')) {
  messageCounts[log.message] = (messageCounts[log.message] ?? 0) + 1;
}
const sortedMessages = Object.entries(messageCounts).sort(
  (a, b) => b[1] - a[1]
);
const maxMsgCount = sortedMessages[0][1];
for (const [msg, count] of sortedMessages) {
  console.log(`  ${bar(count, maxMsgCount)}  ${count}  ${msg}`);
}
