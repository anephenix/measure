/**
 * Financial sector analysis
 *
 * Uses Measure to compare key financial metrics across a group of stocks in the
 * same sector. Z-scores surface potential high-performers or outliers that may
 * warrant closer scrutiny (unusually high growth + P/E + margin can indicate
 * either a genuine standout or fraudulent reporting).
 *
 * Run:
 *   npm run build          # build the library first
 *   node examples/financial-analysis.js
 *
 * In a standalone project, replace the import with:
 *   import Measure from '@anephenix/measure';
 */

import Measure from '../dist/index.js';

// Fictional retail-sector stocks with three performance metrics
const stocks = [
  {
    ticker: 'RETL',
    name: 'RetailCo',
    revenueGrowth: 12.4,
    peRatio: 18.2,
    profitMargin: 8.1,
  },
  {
    ticker: 'SHPX',
    name: 'ShopEx',
    revenueGrowth: 31.7,
    peRatio: 42.5,
    profitMargin: 14.6,
  },
  {
    ticker: 'MKTS',
    name: 'MarketStore',
    revenueGrowth: 6.2,
    peRatio: 11.3,
    profitMargin: 4.9,
  },
  {
    ticker: 'GROC',
    name: 'GrocerPlus',
    revenueGrowth: 3.8,
    peRatio: 9.7,
    profitMargin: 2.1,
  },
  {
    ticker: 'LUXE',
    name: 'LuxeGoods',
    revenueGrowth: 22.1,
    peRatio: 35.0,
    profitMargin: 21.3,
  },
  {
    ticker: 'DISC',
    name: 'DiscountWorld',
    revenueGrowth: 8.9,
    peRatio: 14.8,
    profitMargin: 5.7,
  },
  {
    ticker: 'WNSL',
    name: 'WholesaleCo',
    revenueGrowth: -2.4,
    peRatio: 7.2,
    profitMargin: 1.2,
  },
  {
    ticker: 'FASH',
    name: 'FashionHub',
    revenueGrowth: 18.5,
    peRatio: 26.1,
    profitMargin: 11.4,
  },
  {
    ticker: 'XCEL',
    name: 'XcelRetail',
    revenueGrowth: 55.3,
    peRatio: 98.7,
    profitMargin: 38.9,
  }, // outlier
];

const metrics = [
  { key: 'revenueGrowth', label: 'Revenue Growth (%)', outlierThreshold: 2.0 },
  { key: 'peRatio', label: 'P/E Ratio', outlierThreshold: 2.0 },
  { key: 'profitMargin', label: 'Profit Margin (%)', outlierThreshold: 2.0 },
];

console.log('=== Retail Sector — Financial Analysis ===');

for (const { key, label, outlierThreshold } of metrics) {
  const m = new Measure({ type: 'sample' });
  m.record(stocks.map((s) => s[key]));

  console.log(`\n── ${label} ──`);
  console.log(`   Sector mean:     ${m.mean().toFixed(2)}`);
  console.log(`   Sector median:   ${m.median().toFixed(2)}`);
  console.log(`   Sector stdev:    ${m.stdev().toFixed(2)}`);
  console.log(`   Sector variance: ${m.variance().toFixed(2)}`);

  // Rank all stocks by z-score, highest first
  const ranked = stocks
    .map((s) => ({ ...s, z: m.zscore(s[key]) }))
    .sort((a, b) => b.z - a.z);

  console.log(`\n   Rank  Ticker  Value      Z-score`);
  console.log(`   ────  ──────  ─────────  ───────`);

  for (let i = 0; i < ranked.length; i++) {
    const s = ranked[i];
    const value = String(s[key]).padStart(8);
    const z = s.z.toFixed(2).padStart(7);
    const note =
      s.z > outlierThreshold
        ? '  ▲ high outlier — potential standout or anomaly'
        : s.z < -outlierThreshold
          ? '  ▼ low outlier  — may be underperforming'
          : '';
    console.log(
      `   ${String(i + 1).padStart(4)}  ${s.ticker.padEnd(6)}  ${value}  ${z}${note}`
    );
  }
}

// --- Target example: does any stock's P/E indicate a premium sector? ---
const peTarget = new Measure({
  type: 'sample',
  target: { stat: 'mean', operator: '>', value: 25 },
});
peTarget.record(stocks.map((s) => s.peRatio));

console.log(
  '\n── Sector P/E target check (mean P/E > 25 = premium-valued sector) ──'
);
const status = peTarget.targetStatus();
console.log(`   Mean P/E: ${status.actual.toFixed(2)}`);
console.log(
  `   Target achieved (sector is premium-valued): ${status.achieved}`
);
