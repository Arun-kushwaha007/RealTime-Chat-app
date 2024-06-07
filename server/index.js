const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messagesRoute = require("./routes/messagesRoute");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

console.log("Environment variables loaded:");
console.log(`MONGO_URL: ${process.env.MONGO_URL}`);
console.log(`PORT: ${process.env.PORT}`);

app.use(cors());
app.use(express.json());

// Ensure the correct base URL for your routes
app.use("/api/auth", userRoutes);
app.use("/api/message", messagesRoute);

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("DB Connected successfully");
}).catch((err) => {
    console.error("DB Connection Error: " + err.message);
    process.exit(1); // Exit the process with failure code
});

const port = process.env.PORT || 5000; // Use default port 5000 if process.env.PORT is undefined

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Global error handler to catch unhandled errors
app.use((err, req, res, next) => {
    console.error("Global error handler:", err.stack);
    res.status(500).send('Something broke!');
});

const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credential: true,
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
        // Optionally, remove the user from onlineUsers map
        for (let [userId, sockId] of onlineUsers.entries()) {
            if (sockId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
    });
});
