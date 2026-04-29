import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import fs from 'fs';
const npmDir = process.env.APPDATA.replace(/\\/g, '/') + '/npm/node_modules';
const lhUrl = pathToFileURL(npmDir + '/lighthouse/core/index.js').href;
const clUrl = pathToFileURL(npmDir + '/lighthouse/node_modules/chrome-launcher/dist/chrome-launcher.js').href;
const lighthouse = (await import(lhUrl)).default;
const chromeLauncher = await import(clUrl);

(async () => {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
  });
  try {
    const targetUrl = process.argv[2] || 'http://localhost:3002';
    console.log('Testing:', targetUrl);
    const result = await lighthouse(targetUrl, {
      port: chrome.port,
      output: 'json',
      formFactor: 'mobile',
      throttlingMethod: 'simulate',
    });
    const lhr = result.lhr;
    const c = lhr.categories;
    const a = lhr.audits;
    console.log('=== LIGHTHOUSE MOBILE RESULTS ===');
    console.log('Performance:', Math.round(c.performance.score * 100));
    console.log('Accessibility:', Math.round(c.accessibility.score * 100));
    console.log('Best Practices:', Math.round(c['best-practices'].score * 100));
    console.log('SEO:', Math.round(c.seo.score * 100));
    console.log('---');
    console.log('LCP:', a['largest-contentful-paint'].displayValue, `(${a['largest-contentful-paint'].numericValue}ms)`);
    console.log('TBT:', a['total-blocking-time'].displayValue, `(${a['total-blocking-time'].numericValue}ms)`);
    console.log('CLS:', a['cumulative-layout-shift'].displayValue, `(${a['cumulative-layout-shift'].numericValue})`);
    console.log('SI:', a['speed-index'].displayValue, `(${a['speed-index'].numericValue}ms)`);
    console.log('FCP:', a['first-contentful-paint'].displayValue, `(${a['first-contentful-paint'].numericValue}ms)`);
    console.log('TTI:', a['interactive']?.displayValue || 'N/A');
    console.log('---');
    // Transfer sizes
    const transferAudit = a['network-requests'];
    let totalJS = 0;
    if (transferAudit && transferAudit.details && transferAudit.details.items) {
      for (const item of transferAudit.details.items) {
        if (item.resourceType === 'Script') {
          totalJS += item.transferSize || 0;
        }
      }
    }
    console.log('Total JS Transfer Size:', Math.round(totalJS / 1024) + ' KB');
    console.log('Main Thread Blocking Time:', a['total-blocking-time'].displayValue);
    
    // Check for render-blocking resources
    const renderBlocking = a['render-blocking-resources'];
    if (renderBlocking && renderBlocking.details && renderBlocking.details.items) {
      console.log('Render-blocking resources:', renderBlocking.details.items.length);
      for (const item of renderBlocking.details.items) {
        console.log('  -', item.url?.substring(0, 100), '(' + Math.round((item.wastedMs || 0)) + 'ms)');
      }
    }

    const outPath = process.argv[3] || './reports/lighthouse-mobile.json';
    fs.writeFileSync(outPath, JSON.stringify(lhr, null, 2));
    console.log('\nJSON report saved to reports/lighthouse-mobile.json');
  } finally {
    try { await chrome.kill(); } catch (e) { /* ignore cleanup errors */ }
  }
  process.exit(0);
})();
