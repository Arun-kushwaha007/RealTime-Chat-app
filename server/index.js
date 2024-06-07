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

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

// Global error handler to catch unhandled errors
app.use((err, req, res, next) => {
    console.error("Global error handler:", err.stack);
    res.status(500).send('Something broke!');
});

const io = socket(server,{
    cors: {
        origin: "http://localhost:3000",
        credential:true,
    },
});

global.onlineUsers = new Map();

io.on("connection", (socket)=>{
    global.chatSocket = socket;
    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data)=>{
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-receive", data.message);
        }
    })
})