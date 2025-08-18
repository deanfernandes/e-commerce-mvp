require("dotenv").config();
const { WebSocketServer } = require("ws");
const { URL } = require("node:url");
const jwt = require("jsonwebtoken");
const { MongoClient } = require("mongodb");

const DB_NAME = "chatApp";
const COLLECTION_NAME = "messages";
const client = new MongoClient("mongodb://mongo:27017");

let db;
let messages;

(async () => {
  try {
    await client.connect();
    db = client.db(DB_NAME);
    messages = db.collection(COLLECTION_NAME);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
})();

const wss = new WebSocketServer({ port: process.env.PORT });
const clients = new Set();

wss.on("connection", (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const token = url.searchParams.get("token");

  if (token === "test") {
    ws.close(4001, "Test connection successful");
    console.log("Test connection successful");
    return;
  }

  if (!token) {
    ws.close(4000, "Token query parameter required");
    console.log("Connection rejected: no token provided");
    return;
  }

  if (!messages) {
    console.log("Database not ready");
    ws.close(1011, "Database not ready");
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
  sendChatHistory(ws);

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
      const createdAt = new Date();
      const shortDateTime =
        createdAt.getFullYear() +
        "-" +
        String(createdAt.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(createdAt.getDate()).padStart(2, "0") +
        " " +
        String(createdAt.getHours()).padStart(2, "0") +
        ":" +
        String(createdAt.getMinutes()).padStart(2, "0");

      broadcastChat(ws.user.name, data.message, ws, shortDateTime);
      console.log(`Message from ${ws.user.name}: ${data.message}`);

      try {
        await messages.insertOne({
          userId: ws.user.id,
          userName: ws.user.name,
          message: data.message,
          createdAt: shortDateTime,
        });
      } catch (err) {
        console.error("Error saving message:", err);
      }
    }
  });
});

function broadcastChat(user, message, sender, createdAt) {
  const payload = JSON.stringify({ type: "chat", user, message, createdAt });
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

async function sendChatHistory(ws) {
  try {
    const lastMessages = await messages
      .find({})
      .sort({ createdAt: 1 })
      .limit(25)
      .toArray();

    ws.send(
      JSON.stringify({ type: "chat_history", chatHistory: lastMessages })
    );

    console.log("Sent chat history");
  } catch (err) {
    console.error("Error fetching history:", err);
  }
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
