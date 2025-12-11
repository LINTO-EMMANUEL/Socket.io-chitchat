const express = require("express");

const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const { addMessage } = require("./controllers/messageControllers");

//dotenv config
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//routes import
app.use("/api/messages", require("./routes/messageRoutes"));

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send({
    message: "Welcome to the Chat App API",
    success: true,
    version: "1.0.0",
    endpoints: {
      getMessages: "GET /api/messages",
      createMessage: "POST /api/messages",
      deleteAllMessages: "DELETE /api/messages",
      testClient: "GET /index.html",
    },
  });
});

//scocket connection in backend
io.on("connection", (socket) => {
  console.log("User socket id is : ", socket.id);
  //connect functionality by server
  socket.emit("message", {
    user: "System",
    text: "Welcome to chat",
    timestamp: Date.now(),
  });
  socket.broadcast.emit("message", {
    user: "System",
    text: "A user has joined the chat",
    timestamp: new Date().toISOString(),
  });
  //disconnect functionality by server
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    io.emit("message", {
      user: "System",
      text: "A user has left the chat",
      timestamp: new Date().toISOString(),
    });
  });

  //typing functionality in backend
  socket.on("typing", (data) => {
    socket.broadcast.emit("user typing", data);
  });

  //send and receive message functionality in backend
  socket.on("sendMessage", (data) => {
    const newMessage = addMessage(data);
    io.emit("receiveMessage", newMessage);
  });
});

//Error handling middleware
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});
app.use((error, req, res, next) => {
  res.status(500).json({
    success: false,
    message: "Something went Wrong",
    error: error.message,
  });
});
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
