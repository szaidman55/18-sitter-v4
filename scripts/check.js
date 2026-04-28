const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
const goTargets = [...new Set([...html.matchAll(/go\('([^']+)'\)/g)].map((match) => match[1]))];
const missingTargets = goTargets.filter((target) => !ids.includes(target));
const requiredFiles = [
  "index.html",
  "public/manifest.webmanifest",
  "public/sw.js",
  "public/brand/18-sitters-icon-only-clean.svg",
  "public/brand/18-sitters-icon-only-clean.png",
  "public/icons/icon-32.png",
  "public/icons/icon-64.png",
  "public/icons/icon-180.png",
  "public/icons/icon-192.png",
  "public/icons/icon-512.png",
  "public/icons/icon-1024.png"
];
const missingFiles = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));

if (duplicateIds.length || missingTargets.length || missingFiles.length) {
  console.error(JSON.stringify({ duplicateIds, missingTargets, missingFiles }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  screens: ids.filter((id) => id.startsWith("s-")).length,
  goTargets: goTargets.length,
  duplicateIds: 0,
  missingTargets: 0,
  missingFiles: 0
}, null, 2));
