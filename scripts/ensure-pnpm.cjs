#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Remove package-lock.json and yarn.lock if they exist
const lockfiles = ['package-lock.json', 'yarn.lock'];
lockfiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
});

// Check that pnpm is being used
const userAgent = process.env.npm_config_user_agent || '';
if (!userAgent.startsWith('pnpm/')) {
  console.error('Use pnpm instead');
  process.exit(1);
}
