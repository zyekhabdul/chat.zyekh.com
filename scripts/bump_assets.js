#!/usr/bin/env node
/**
 * bump_assets.js
 * Automatically updates asset version hashes in index.html and 404.html.
 * Usage: node scripts/bump_assets.js
 */

import fs from 'fs';
import path from 'path';

const ROOT_DIR = path.resolve(process.cwd());
const HTML_FILES = ['index.html', '404.html'];

function generateVersionTag() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  const secs = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}_${hours}${mins}${secs}`;
}

function bumpAssets() {
  const vTag = generateVersionTag();
  let totalReplacements = 0;

  for (const htmlFile of HTML_FILES) {
    const filePath = path.join(ROOT_DIR, htmlFile);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf-8');

    // Replace app.css?v=...
    const cssRegex = /(assets\/css\/app\.css\?v=)[a-zA-Z0-9_]+/g;
    const jsRegex = /(assets\/js\/app\.js\?v=)[a-zA-Z0-9_]+/g;

    let replaced = false;
    if (cssRegex.test(content)) {
      content = content.replace(cssRegex, `$1${vTag}`);
      replaced = true;
    }
    if (jsRegex.test(content)) {
      content = content.replace(jsRegex, `$1${vTag}`);
      replaced = true;
    }

    if (replaced) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`[ BUMP ] ${htmlFile} -> v=${vTag}`);
      totalReplacements++;
    }
  }

  console.log(`[ SUCCESS ] Updated ${totalReplacements} HTML files with asset tag: v=${vTag}`);
}

bumpAssets();
