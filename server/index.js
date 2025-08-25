const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
const userRoutes = require("./routes/userRoutes");
const messagesRoute = require("./routes/messagesRoute");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

console.log("Environment variables loaded:");
console.log(`MONGO_URL: ${process.env.MONGO_URL}`);
console.log(`PORT: ${process.env.PORT}`);

app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://real-time-chat-app-client-taupe.vercel.app"
    ],
    credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/message", messagesRoute);

// const axios = require("axios");

// Add this to your server.js file, replacing the existing avatar endpoint

// Alternative avatar endpoint that doesn't depend on external APIs
app.get("/api/avatar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Generate deterministic colors based on ID
    const hash = id.toString().split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    
    const bgColor = colors[Math.abs(hash) % colors.length];
    const textColor = '#FFFFFF';
    
    // Create simple geometric avatar
    const patterns = [
      // Circle pattern
      `<circle cx="50" cy="50" r="35" fill="${bgColor}" />
       <circle cx="50" cy="40" r="12" fill="${textColor}" opacity="0.8" />
       <ellipse cx="50" cy="70" rx="20" ry="15" fill="${textColor}" opacity="0.8" />`,
      
      // Square pattern
      `<rect x="15" y="15" width="70" height="70" rx="10" fill="${bgColor}" />
       <circle cx="35" cy="35" r="8" fill="${textColor}" />
       <circle cx="65" cy="35" r="8" fill="${textColor}" />
       <rect x="40" y="55" width="20" height="8" rx="4" fill="${textColor}" />`,
      
      // Triangle pattern
      `<polygon points="50,20 20,80 80,80" fill="${bgColor}" />
       <circle cx="42" cy="45" r="6" fill="${textColor}" />
       <circle cx="58" cy="45" r="6" fill="${textColor}" />
       <path d="M 40 60 Q 50 70 60 60" stroke="${textColor}" stroke-width="3" fill="none" stroke-linecap="round" />`,
    ];
    
    const pattern = patterns[Math.abs(hash) % patterns.length];
    
    const svg = `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="#f0f0f0" />
        ${pattern}
      </svg>
    `;
    
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(svg.trim());
    
  } catch (error) {
    console.error(`🔴 Error generating avatar for ID ${req.params.id}:`, error.message);
    res.status(500).send("Internal Server Error");
  }
});
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("DB Connected successfully");
}).catch((err) => {
    console.error("DB Connection Error: " + err.message);
    process.exit(1); // Exit the process with failure code
});

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Global error handler:", err.stack);
    res.status(500).send('Something broke!');
});

// WebSocket Setup
const io = socket(server, {
    cors: {
        origin: ["http://localhost:3000",
          "https://real-time-chat-app-client-taupe.vercel.app"],

        credentials: true,
    },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    global.chatSocket = socket;

    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", data.message);
            console.log(`Message from ${data.from} to ${data.to}: ${data.message}`);
        }
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
        for (let [userId, sockId] of onlineUsers.entries()) {
            if (sockId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
    });
});
