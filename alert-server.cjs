// Zero-dependency WebSocket server for Volunteer Alert Demo
// Uses ONLY built-in Node.js modules — no npm install needed!
// Run with: node alert-server.cjs

const http = require("http");

const PORT = 3001;

// Store all connected SSE clients
const clients = new Set();

const server = http.createServer((req, res) => {
  // Allow cross-origin from the Vite app
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // ── SSE endpoint: phones connect here to listen for alerts
  if (req.method === "GET" && req.url === "/events") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    });

    // Send current device count immediately
    const sendCount = () => {
      clients.forEach(c => {
        try { c.write(`data: ${JSON.stringify({ type: "count", count: clients.size })}\n\n`); } catch(_) {}
      });
    };

    clients.add(res);
    console.log(`📱 Device connected. Total: ${clients.size}`);
    sendCount();

    // Clean up on disconnect
    req.on("close", () => {
      clients.delete(res);
      console.log(`📴 Device disconnected. Total: ${clients.size}`);
      sendCount();
    });

    return;
  }

  // ── Trigger endpoint: admin posts alert here
  if (req.method === "POST" && req.url === "/send-alert") {
    let body = "";
    req.on("data", chunk => { body += chunk.toString(); });
    req.on("end", () => {
      try {
        const alertData = JSON.parse(body);
        const payload = JSON.stringify({ type: "alert", ...alertData, deviceCount: clients.size });

        console.log(`🚨 ALERT sent to ${clients.size} devices`);

        // Broadcast to ALL connected clients
        clients.forEach(client => {
          try { client.write(`data: ${payload}\n\n`); } catch(_) {}
        });

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, reached: clients.size }));
      } catch (e) {
        res.writeHead(400);
        res.end("Bad request");
      }
    });
    return;
  }

  // ── Status page
  if (req.method === "GET" && req.url === "/status") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, devices: clients.size }));
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("");
  console.log("╔══════════════════════════════════════════╗");
  console.log("║   🚨 Volunteer Alert Server (No deps!)   ║");
  console.log(`║   Running on port ${PORT}                   ║`);
  console.log("╚══════════════════════════════════════════╝");
  console.log("");
  console.log("✅ Open the app on all phones. When admin clicks");
  console.log("   'Send Alert', ALL phones will receive it instantly!\n");
});
