import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { triggerNewsFetch, triggerResearchFetch } from "../db";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    scheduleDailyFetch();
  });
}

function scheduleDailyFetch() {
  const now = new Date();
  const next2am = new Date();
  next2am.setHours(2, 0, 0, 0);

  // If today's 2am has passed, schedule for tomorrow
  if (next2am <= now) {
    next2am.setDate(next2am.getDate() + 1);
  }

  const msUntilNext2am = next2am.getTime() - now.getTime();

  console.log(`[Scheduler] Next fetch scheduled at ${next2am.toISOString()}`);

  setTimeout(async () => {
    console.log("[Scheduler] Starting daily auto-fetch...");
    try {
      const newsResult = await triggerNewsFetch();
      console.log(`[Scheduler] News fetch done — added:${newsResult.added}`);
    } catch (err) {
      console.error("[Scheduler] News fetch failed:", err);
    }

    try {
      const researchResult = await triggerResearchFetch();
      console.log(`[Scheduler] Research fetch done — added:${researchResult.added}`);
    } catch (err) {
      console.error("[Scheduler] Research fetch failed:", err);
    }

    // Recurse to schedule the next day
    scheduleDailyFetch();
  }, msUntilNext2am);
}

startServer().catch(console.error);
