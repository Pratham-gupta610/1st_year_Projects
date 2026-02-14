import { createServer } from "http";
import { readFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { writeFile } from "fs/promises";

const PORT = 8080;
const DATA_FILE = path.join("data", "links.json");

const serveFile = async (res, filePath, contentType) => {
  try {
    const data = await readFile(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  } catch (error) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 page not found");
  }
};

const loadlinks = async () => {
  try {
    const data = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      // ENOENT means Error no entry
      await writeFile(DATA_FILE, JSON.stringify({}));
      return {};
    }
    throw error;
  }
};

const savelinks = async (links) => {
  await writeFile(DATA_FILE, JSON.stringify(links, null, 2));
};

const server = createServer(async (req, res) => {
  console.log(req.url);

  if (req.method === "GET") {
    if (req.url === "/") {
      return serveFile(res, path.join("public", "index.html"), "text/html");
    } else if (req.url === "/style.css") {
      return serveFile(res, path.join("public", "style.css"), "text/css");
    } else if (req.url === "/script1.js") {
      return serveFile(
        res,
        path.join("public", "script1.js"),
        "application/javascript"
      );
    } else if (req.url === "/links") {
      const links = await loadlinks();
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(links));
    } else {
      // Handle redirect for shortened URLs
      const shortcode = req.url.slice(1); // Remove leading "/"
      const links = await loadlinks();

      if (links[shortcode]) {
        // Handle both old format (string) and new format (object with timestamp)
        const targetUrl =
          typeof links[shortcode] === "string"
            ? links[shortcode]
            : links[shortcode].url;
        res.writeHead(302, { Location: targetUrl });
        return res.end();
      }
    }
  }

  if (req.method === "POST" && req.url === "/shorten") {
    const links = await loadlinks();
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      console.log(body);
      const { url, shortcode } = JSON.parse(body);
      if (!url) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        return res.end("URL is required !!");
      }
      const finalShortcode = shortcode || crypto.randomBytes(4).toString("hex");
      if (links[finalShortcode]) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        return res.end("Short-Code already exists. Please choose another.");
      }

      // Store with timestamp for proper ordering
      links[finalShortcode] = {
        url: url,
        timestamp: Date.now(),
      };

      await savelinks(links);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, shortcode: finalShortcode }));
    });
  }
});

server.listen(PORT, () => {
  console.log(`🚀🚀 Server running at http://localhost:${PORT}`);
});