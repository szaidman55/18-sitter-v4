const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

function copyDir(source, target) {
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name);
    const to = path.join(target, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
fs.copyFileSync(path.join(root, "index.html"), path.join(dist, "index.html"));
copyDir(path.join(root, "public"), dist);

const config = {
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "",
  environment: process.env.APP_ENV || "local"
};
fs.writeFileSync(
  path.join(dist, "config.js"),
  `window.APP_CONFIG = ${JSON.stringify(config, null, 2)};\n`
);

console.log("Built static site to dist/");
