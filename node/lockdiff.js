const fs = require("fs");

const [basePath, headPath] = process.argv.slice(2);

if (!basePath || !headPath) {
  console.error("Usage: node lockdiff.js <base.lock> <head.lock>");
  process.exit(1);
}

const base = JSON.parse(fs.readFileSync(basePath, "utf8"));
const head = JSON.parse(fs.readFileSync(headPath, "utf8"));

const bp = base.packages || base.dependencies || {};
const hp = head.packages || head.dependencies || {};

const getName = (key) => key.replace(/^node_modules\//, "");
const changes = [];

for (const [key, info] of Object.entries(bp)) {
  if (!key) continue;
  const name = getName(key);
  if (hp[key]) {
    if (info.version !== hp[key].version) {
      changes.push(`${name} ${info.version} -> ${hp[key].version}`);
    }
  } else {
    changes.push(`${name} removed`);
  }
}

for (const [key, info] of Object.entries(hp)) {
  if (!key) continue;
  if (!bp[key]) {
    changes.push(`${getName(key)} added`);
  }
}

console.log([...new Set(changes)].sort().join("\n"));
