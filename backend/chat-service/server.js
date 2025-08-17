require("dotenv").config();
const { WebSocketServer } = require("ws");
const { URL } = require("node:url");
const jwt = require("jsonwebtoken");

const wss = new WebSocketServer({ port: process.env.PORT });
const clients = new Set();

wss.on("connection", (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const token = url.searchParams.get("token");

  if (!token) {
    ws.close(4000, "Token query parameter required");
    console.log("Connection rejected: no token provided");
    return;
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    ws.close(4000, "Invalid token");
    console.log("Connection rejected: invalid token provided");
    return;
  }

  ws.user = { id: decoded.id, name: decoded.name };
  clients.add(ws);
  console.log(`${ws.user.name} connected`);

  broadcastSystem(`${ws.user.name} joined the chat`, ws);
  sendChatList(ws);

  ws.on("close", () => {
    clients.delete(ws);
    console.log(`${ws.user.name} disconnected`);
    broadcastSystem(`${ws.user.name} left the chat`, ws);
  });

  ws.on("message", async (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch {
      console.log("Invalid message format");
      return;
    }

    if (data.type === "chat" && data.message) {
      broadcastChat(ws.user.name, data.message, ws);
      console.log(`Message from ${ws.user.name}: ${data.message}`);
    }
  });
});

function broadcastChat(user, message, sender) {
  const payload = JSON.stringify({ type: "chat", user, message });
  for (const client of clients) {
    if (client.readyState === client.OPEN && client !== sender) {
      client.send(payload);
    }
  }
}

function broadcastSystem(message, sender) {
  const payload = JSON.stringify({ type: "system", message });
  for (const client of clients) {
    if (client.readyState === client.OPEN && client !== sender) {
      client.send(payload);
    }
  }
}

function sendChatList(ws) {
  const currentUsers = Array.from(clients).map((c) => c.user.name);
  ws.send(JSON.stringify({ type: "users", users: currentUsers }));
}

setInterval(() => {
  const currentUsers = Array.from(clients).map((c) => c.user.name);
  const payload = JSON.stringify({ type: "users", users: currentUsers });
  for (const client of clients) {
    if (client.readyState === client.OPEN) {
      client.send(payload);
    }
  }
}, 10000);

console.log(
  `WebSocket chat server running on ws://localhost:${process.env.PORT}`
);
