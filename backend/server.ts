import express from "express";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { cloneSiteData } from "../src/lib/site-data";
import { loadSiteDataFromDatabase, saveSiteDataToDatabase } from "../src/lib/db.server";

const app = express();
const port = Number(process.env.PORT ?? 3001);
const distDir = resolve(process.cwd(), "dist");
const indexHtml = resolve(distDir, "index.html");

app.use(express.json({ limit: "50mb" }));

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.get("/api/site-data", async (_request, response) => {
  try {
    const siteData = await loadSiteDataFromDatabase();
    response.json({ data: siteData });
  } catch (error) {
    console.error(error);
    response.status(500).json({ ok: false, message: "Failed to load site data." });
  }
});

app.post("/api/site-data", async (request, response) => {
  try {
    const body = request.body as { data?: unknown };
    if (!body?.data) {
      response.status(400).json({ ok: false, message: "Missing site data." });
      return;
    }

    const siteData = cloneSiteData(body.data);
    await saveSiteDataToDatabase(siteData);
    response.json({ ok: true });
  } catch (error) {
    console.error(error);
    response.status(500).json({ ok: false, message: "Failed to save site data." });
  }
});

if (existsSync(distDir)) {
  app.use(express.static(distDir, { index: false }));
  app.get(/^\/(?!api\/).*/, (_request, response, next) => {
    if (existsSync(indexHtml)) {
      response.sendFile(indexHtml);
      return;
    }
    next();
  });
}

app.listen(port, () => {
  console.log(`Node backend listening on http://localhost:${port}`);
});
