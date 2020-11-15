const fs = require('fs');
const path = require('path');

const name = path.basename(__filename);
const prodHtml = path.join(__dirname, '../index.html');
const prodCss = path.join(__dirname, '../style.css');
const devDir = path.join(__dirname, '../dev');
const devHtml = path.join(__dirname, '../dev/index.html');
const devCss = path.join(__dirname, '../dev/style.css');

function stat(p) {
  try {
    return fs.statSync(p);
  } catch {
    return null;
  }
}

try {
  fs.mkdirSync(devDir);
  console.info(`${name}: Created '${devDir}'.`);
} catch (err) {
  if (err.code !== 'EEXIST') {
    throw err;
  } else {
    console.info(`${name}: '${devDir}' already exists.`);
  }
}

const prodHtmlStat = stat(prodHtml);
if (prodHtmlStat) {
  const text = fs
    .readFileSync(prodHtml, { encoding: 'utf-8' })
    .replace(/production\.min\.js/g, 'development.js')
    .replace(/\.\.\/javascript-minimal-web/g, '../../javascript-minimal-web');
  let match = false;
  const devHtmlStat = stat(devHtml);
  if (devHtmlStat) {
    const t = fs.readFileSync(devHtml, { encoding: 'utf-8' });
    if (t === text) {
      match = true;
    }
  }
  if (match) {
    console.info(`${name}: '${devHtml}' up-to-date.`);
  } else {
    fs.writeFileSync(devHtml, text, { encoding: 'utf-8' });
    console.info(`${name}: Generated '${devHtml}'.`);
  }
} else {
  console.warn(`${name}: '${prodHtml}' not found.`);
}

const prodCssStat = stat(prodCss);
if (prodCssStat) {
  let match = false;
  const devCssStat = stat(devCss);
  if (devCssStat) {
    const a = fs.readFileSync(prodCss, { encoding: 'utf-8' });
    const b = fs.readFileSync(devCss, { encoding: 'utf-8' });
    if (a === b) {
      match = true;
    }
  }
  if (match) {
    console.info(`${name}: '${devCss}' up-to-date.`);
  } else {
    fs.copyFileSync(prodCss, devCss);
    console.info(`${name}: Copied '${prodCss}' to '${devCss}'.`);
  }
} else {
  console.warn(`${name}: '${prodCss}' not found.`);
}
