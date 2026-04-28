const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "dist");
const fallback = path.join(root, "index.html");
const port = Number(process.env.PORT || 4173);

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".txt": "text/plain; charset=utf-8"
};

http.createServer((request, response) => {
  const urlPath = decodeURIComponent(new URL(request.url, `http://localhost:${port}`).pathname);
  const requested = path.normalize(path.join(root, urlPath));
  const file = requested.startsWith(root) && fs.existsSync(requested) && fs.statSync(requested).isFile()
    ? requested
    : fallback;
  response.setHeader("Content-Type", mime[path.extname(file)] || "application/octet-stream");
  fs.createReadStream(file).pipe(response);
}).listen(port, () => {
  console.log(`18 Sitters v4 preview: http://localhost:${port}`);
});
